import CanvasUtil2 from "../engine/CanvasUtil2"
import {BaseConfig, Rect} from "../config/BaseConfig"
import helper from "../utils/helper"
import {Colors, defaultConfig} from "../utils/constant"
import draw from "../utils/draw"
import {ParentShape} from "./core/ParentShape";
import {BaseEvent2, EditType, LinePath, LineShape, LineType, P, ShapeStatus} from "../types/type"
import {BaseShape} from "./core/BaseShape"
import {PenConfig, PenNetworkLine} from "../config/PenConfig"
import {Math2} from "../utils/math"
import {cloneDeep, eq} from "lodash"
import {Bezier} from "bezier-js"

export class Pen extends ParentShape {
  mouseDown: boolean = false

  get _conf(): PenConfig {
    return this.conf as any
  }

  set _conf(val) {
    this.conf = val
  }

  beforeEvent(event: BaseEvent2): boolean {
    if (this.status === ShapeStatus.Edit) {
      event.stopPropagation()
      super.emit(event, [])
      return true
    }
    return false
  }

  beforeIsInShape(): boolean {
    return false
  }

  drawShape(ctx: CanvasRenderingContext2D, newLayout: Rect, parent?: BaseConfig): any {
    if (this.status === ShapeStatus.Edit) return
    let {
      fillColor, lineWidth, borderColor, center
    } = this.conf

    ctx.lineWidth = lineWidth ?? defaultConfig.lineWidth
    ctx.lineCap = "round"
    ctx.strokeStyle = borderColor
    ctx.fillStyle = fillColor
    let {strokePathList, fillPathList} = this.getCustomShapePath3()

    fillPathList.map(({close, path}) => {
      // ctx.fill(path,'evenodd')
      ctx.fill(path, 'nonzero')
    })
    strokePathList.map(line => {
      ctx.stroke(line.path)
    })

    ctx.strokeStyle = 'white'
    fillPathList.map(({close, path}) => {
      // ctx.fill(path,'evenodd')
      ctx.stroke(path)
    })

    //绘制所有点
    ctx.font = `400 18rem "SourceHanSansCN", sans-serif`
    this._conf.penNetwork.nodes.map((point, i) => {
      // let a = helper.getStraightLineCenterPoint(fixStartPoint, fixEndPoint)
      ctx.fillText(i + '', point.x, point.y)
      // draw.drawRound(ctx, point)
    })

    // draw.drawRound(ctx, {x: 0, y: 0})
  }

  drawHover(ctx: CanvasRenderingContext2D, newLayout: Rect): any {
    ctx.strokeStyle = defaultConfig.strokeStyle
    //容器hover时只需要描边矩形就行了
    let {strokePathList, fillPathList} = this.getCustomShapePath3()
    strokePathList.map(({close, path}) => {
      ctx.stroke(path)
    })
  }

  drawSelected(ctx: CanvasRenderingContext2D, newLayout: Rect): any {
    ctx.strokeStyle = defaultConfig.strokeStyle
    //容器hover时只需要描边矩形就行了
    let {strokePathList, fillPathList} = this.getCustomShapePath3()
    strokePathList.map(({close, path}) => {
      ctx.stroke(path)
    })
    draw.selected(ctx, newLayout)
  }

  drawEdit(ctx: CanvasRenderingContext2D, newLayout: Rect): any {
    // this.log('drawEdit',)
    ctx.save()
    let {
      fillColor
    } = this.conf

    ctx.save()
    ctx.strokeStyle = Colors.Line2
    ctx.fillStyle = fillColor

    let {strokePathList, fillPathList} = this.getCustomShapePath3()
    fillPathList.map(({close, path}) => {
      // ctx.fill(path, 'evenodd')
      ctx.fill(path)
    })
    strokePathList.map(({close, path}) => {
      ctx.stroke(path)
    })

    //渲染hover在线上时，线段的中心点
    if ((this.editHover.type === EditType.Line
        || this.editHover.type === EditType.CenterPoint)
      && this.editHover.lineIndex !== -1
    ) {
      draw.drawRound(ctx, this.hoverLineCenterPoint)
    }
    const {nodes, paths, ctrlNodes} = this._conf.penNetwork

    //绘制所有点
    nodes.map(point => {
      // if (point.cp1.use) draw.controlPoint(ctx, point.cp1, point.center)
      // if (point.cp2.use) draw.controlPoint(ctx, point.cp2, point.center)
      draw.drawRound(ctx, point)
    })

    let {pointIndex, type} = this.editStartPointInfo
    //再绘制选中的当前点和控制点，之所以分开绘制，是因为遮盖问题
    if (type === EditType.Point || type === EditType.ControlPoint) {
      let currentPoint = nodes[pointIndex]
      let points = paths.filter(p => p.slice(0, 2).includes(pointIndex)).reduce((p: number[], c: PenNetworkLine) => {
        if (!p.includes(c[0])) p.push(c[0])
        if (!p.includes(c[1])) p.push(c[1])
        return p
      }, []).map(v => nodes[v])

      points.map(point => {
        point.cps.map(v => {
          if (v !== -1) draw.controlPoint(ctx, ctrlNodes[v], point)
        })
        if (eq(point, currentPoint)) {
          draw.currentPoint(ctx, point)
        } else {
          draw.drawRound(ctx, point)
        }
      })
      // draw.currentPoint(ctx, point)
    }

    if (this.tempPoint) {
      draw.currentPoint(ctx, this.tempPoint)
    }

    ctx.restore()
  }

  isInShape(mousePoint: P, cu: CanvasUtil2): boolean {
    return helper.isInBox(mousePoint, this.conf.box)
  }

  isInShapeOnSelect(p: P, cu: CanvasUtil2): boolean {
    return false
  }

  onDbClick(event: BaseEvent2, parents: BaseShape[]): boolean {
    return false
  }

  onMouseDown(event: BaseEvent2, parents: BaseShape[]): boolean {
    // console.log('pen-onMouseDown')
    return false
  }

  onMouseMove(event: BaseEvent2, parents: BaseShape[]): boolean {
    // console.log('pen-onMouseMove')
    return false
  }

  onMouseUp(event: BaseEvent2, parents: BaseShape[]): boolean {
    // console.log('pen-onMouseUp')
    this.mouseDown = false
    return false
  }

  getCustomPoint(): LineShape[] {
    return []
  }

  getCustomShapePath3(): { strokePathList: LinePath[], fillPathList: LinePath[] } {
    let showTime = true
    let showFill = true
    if (showTime) {
      console.time()
    }
    let strokePathList: LinePath[] = []
    let fillPathList: LinePath[] = []
    const {nodes, paths, ctrlNodes} = this._conf.penNetwork
    if (paths.length) {
      let singLines: PenNetworkLine[][] = []
      let selfIntersectionLines: PenNetworkLine[] = []

      let newNodes = cloneDeep(nodes)
      let newCtrlNodes = cloneDeep(ctrlNodes)
      let lineMaps = new Map<number, any[]>()

      //查找交点，并将交点记录到对应的线段上
      for (let i = 0; i < paths.length - 1; i++) {
        let currentLine = paths[i]
        let p1 = nodes[currentLine[0]],
          p2 = nodes[currentLine[1]],
          line1Type = currentLine[6]
        //如果是三次曲线，可能会自相交
        if (line1Type === LineType.Bezier3) {
          let curve = new Bezier(p1, ctrlNodes[currentLine[2]], ctrlNodes[currentLine[3]], p2)
          let pair = curve.selfintersects()
          if (pair.length) {
            // console.log('t', pair, 'i', i,)
            selfIntersectionLines.push(currentLine)
          }
        }
        for (let j = i + 1; j < paths.length; j++) {
          let nextLine = paths[j]
          let result = Math2.isIntersection3(currentLine, nextLine, newNodes, newCtrlNodes)
          // console.log('i', i, 'j', j, 'result', result)
          if (result) {
            let lineMap = lineMaps.get(i)
            if (lineMap) {
              lineMap = lineMap.concat(result.start)
              lineMaps.set(i, lineMap)
            } else {
              lineMaps.set(i, result.start)
            }
            lineMap = lineMaps.get(j)
            if (lineMap) {
              lineMap = lineMap.concat(result.end)
              lineMaps.set(j, lineMap)
            } else {
              lineMaps.set(j, result.end)
            }
          }
        }
      }

      //然后将有交点的线段分割
      let newPaths: any[] = []
      paths.map((line, index) => {
        let lineMap = lineMaps.get(index)
        if (lineMap) {
          lineMap.sort((a, b) => {
            return a.t - b.t
          })
          let lineType = line[6]
          if (lineType === LineType.Line) {
            let newLines: any = [line]
            lineMap.map(v => {
              // console.log('v',v)
              let lastLine = newLines[newLines.length - 1]
              newLines.pop()
              newLines = newLines.concat([
                [lastLine[0], v.index, -1, -1, -1, -1, lineType],
                [v.index, lastLine[1], -1, -1, -1, -1, lineType]
              ])
            })
            newPaths = newPaths.concat(newLines)
          } else {
            let p1 = nodes[line[0]],
              p2 = nodes[line[1]],
              splitCurve: Bezier
            if (lineType === LineType.Bezier2) {
              let cp: P
              if (line[2] !== -1) cp = ctrlNodes[line[2]]
              if (line[3] !== -1) cp = ctrlNodes[line[3]]
              splitCurve = new Bezier(p1, cp!, p2)
            } else {
              splitCurve = new Bezier(p1, ctrlNodes[line[2]], ctrlNodes[line[3]], p2)
            }
            let newLines: any = [line]
            lineMap.map(v => {
              // console.log('v',v)
              let lastLine = newLines[newLines.length - 1]
              newLines.pop()
              let split = splitCurve!.split(v.t)
              let leftPoints = split.left.points
              let newLine = []
              if (leftPoints.length === 3) {
                newCtrlNodes.push(leftPoints[1])
                newLine = [lastLine[0], v.index, newCtrlNodes.length - 1, -1, -1, -1, lineType]
              } else {
                newCtrlNodes.push(leftPoints[1])
                newCtrlNodes.push(leftPoints[2])
                newLine = [lastLine[0], v.index, newCtrlNodes.length - 2, newCtrlNodes.length - 1, -1, -1, lineType]
              }

              splitCurve = split.right
              let rightPoints = split.right.points
              let rightNewLine = []
              if (rightPoints.length === 3) {
                newCtrlNodes.push(rightPoints[1])
                rightNewLine = [v.index, lastLine[1], newCtrlNodes.length - 1, -1, -1, -1, lineType]
              } else {
                newCtrlNodes.push(rightPoints[1])
                newCtrlNodes.push(rightPoints[2])
                rightNewLine = [v.index, lastLine[1], newCtrlNodes.length - 2, newCtrlNodes.length - 1, -1, -1, lineType]
              }
              newLines = newLines.concat([
                newLine,
                rightNewLine
              ])
            })
            newPaths = newPaths.concat(newLines)
          }
        } else {
          newPaths.push(line)
        }
      })

      // console.log('newNodes', cloneDeep(newNodes))
      console.log('lineMaps', cloneDeep(lineMaps))
      console.log('newPaths', cloneDeep(newPaths))

      let closeLines: any[] = []
      //筛选出终点没人连的
      closeLines = newPaths.filter((v, i) => {
        let r = newPaths.find((w, j) => ((v[0] === w[1] || v[0] === w[0]) && i !== j))
        let r2 = newPaths.find((w, j) => ((v[1] === w[1] || v[1] === w[0]) && i !== j))
        return r2 && r
      })
      let closeLinesWithId = closeLines.map((v, i) => ({id: i, line: v}))

      let closeAreasRepeat: any[][] = []

      const check = (lines: any[]) => {
        let listIndexStr = lines.map(v => v.id).sort((a, b) => a - b).join('')
        return closeAreasRepeat.find(w => w.map(w => w.id).sort((a, b) => a - b).join('') === listIndexStr)
      }

      let visited: number[] = []
      //寻找封闭图
      const findCloseArea = (start: number, end: number, line: any, list: any[], save: any[]) => {
        visited.push(line.id)
        let arrsEnd = list.filter(w => w.line.slice(0,2).includes(end) && w.id !== line.id)
        while (arrsEnd.length !== 0) {
          if (arrsEnd.length === 1) {
            //这里用复制一遍。因为后续的其他遍历，可能也会碰到这条线，然后方向是相反的，又去改变头和尾
            let a = cloneDeep(arrsEnd[0])
            let line = a.line
            if (line[0] === end) {
              end = line[1]
            } else {
              end = line[0]
              //交换顺序
              a.line[0] = a.line[1]
              a.line[1] = end
            }
            visited.push(a.id)
            save.push(a)
            if (end === start) {
              return [save]
            }
            //如果当前线段与线段们中的任一组成了回路，那么就是一个新的封闭图
            let isCloseIndex = save.findIndex(b => b.line[0] === end)
            if (isCloseIndex > -1) {
              return [save.slice(isCloseIndex)]
            }
            arrsEnd = list.filter(w => w.line.slice(0,2).includes(end) && w.id !== a.id)
          } else {
            for (let i = 0; i < arrsEnd.length; i++) {
              let newSave = save.slice()
              let a = cloneDeep(arrsEnd[i])
              let newEnd = -1
              if (a.line[0] === end) {
                newEnd = a.line[1]
              } else {
                newEnd = a.line[0]
                a.line[0] = a.line[1]
                a.line[1] = newEnd
              }
              newSave.push(a)
              let isCloseIndex = newSave.findIndex(b => b.line[0] === newEnd)
              if (isCloseIndex > -1) {
                let closeArea = newSave.slice(isCloseIndex)
                if (!check(closeArea)) {
                  closeAreasRepeat = closeAreasRepeat.concat([closeArea])
                }
              } else if (newEnd === start) {
                if (!check(newSave)) {
                  closeAreasRepeat = closeAreasRepeat.concat([newSave])
                }
              } else {
                let r = findCloseArea(start, newEnd, a, list, newSave)
                if (r.length) {
                  if (!check(r[0])) {
                    closeAreasRepeat = closeAreasRepeat.concat(r)
                  }
                }
              }
            }
            return []
          }
        }
        return []
      }

      //TODO 想想，如果只有两条直线，那么根本无需检测，肯定没有封闭图。如果是曲线呢？
      if (closeLinesWithId.length >= 2 && true) {
        closeLinesWithId.map(currentLine => {
          if (!visited.includes(currentLine.id)) {
            let start = currentLine.line[0]
            let end = currentLine.line[1]
            let r = findCloseArea(start, end, currentLine, closeLinesWithId.slice(), [currentLine])
            if (r.length) {
              if (!check(r[0])) {
                closeAreasRepeat = closeAreasRepeat.concat(r)
              }
            }
          }
        })

        let closeAreasId = closeAreasRepeat.map((v, i) => ({id: i, area: v}))
        let closeAreasIdCopy = cloneDeep(closeAreasId)
        let waitDelId: any[] = []
        closeAreasId.map((a: any, i: number) => {
          if (waitDelId.includes(a.id)) return
          let ids = a.area.map((l: any) => l.id)
          let q: any[] = closeAreasIdCopy.filter((b: any, j: number) => {
            let count = 0
            if (i !== j) {
              b.area.map((c: any) => {
                if (ids.find((id: any) => id === c.id)) {
                  count++
                }
              })
            }
            return count >= 2
          })

          if (q.length) {
            let n = q.concat([a])
            let s = n.sort((a: any, b: any) => a.area.length - b.area.length).map(s => s.id)
            if (a.id !== s[0]) {
              let r = closeAreasIdCopy.findIndex(b => b.id === a.id)
              if (r) {
                closeAreasIdCopy.splice(r, 1)
              }
              waitDelId = waitDelId.concat([a.id])
            }
          }
        })

        waitDelId.map(v1 => {
          let r = closeAreasId.findIndex(b => b.id === v1)
          if (r) {
            closeAreasId.splice(r, 1)
          }
        })

        // console.log('visited', cloneDeep(Array.from(new Set(visited))))

        console.log('closeLines', cloneDeep(closeLines))
        console.log('closeLinesWithId', cloneDeep(closeLinesWithId))
        console.log('closeAreasRepeat----', cloneDeep(closeAreasRepeat))
        console.log('closeAreas----', cloneDeep(closeAreasId.map(v => v.area)))

        let cu = CanvasUtil2.getInstance()
        let {ctx} = cu
        ctx.font = `400 18rem "SourceHanSansCN", sans-serif`
        newNodes.map((point, i) => {
          ctx.fillText(i + '', point.x, point.y)
          // draw.drawRound(ctx, point)
        })

        let {center} = this.conf
        cu.waitRenderOtherStatusFunc.push(() => {
          ctx.save()
          ctx.strokeStyle = 'red'
          ctx.fillStyle = 'red'
          closeLinesWithId.map(line => {
            let startPoint = newNodes[line.line[0]]
            let fixStartPoint = {
              x: center.x + startPoint.x,
              y: center.y + startPoint.y,
            }
            let endPoint = newNodes[line.line[1]]
            let fixEndPoint = {
              x: center.x + endPoint.x,
              y: center.y + endPoint.y,
            }
            ctx.moveTo2(fixStartPoint)
            ctx.lineTo2(fixEndPoint)
            cu.ctx.font = `400 16rem "SourceHanSansCN", sans-serif`
            let a = helper.getStraightLineCenterPoint(fixStartPoint, fixEndPoint)
            // ctx.fillText(`${line.line[0]}-${line.line[1]}:${line.id}`, a.x - 20, a.y)
            ctx.fillText(`${line.id}`, a.x, a.y)
          })
          ctx.stroke()

          //   if (showFill) {
          //     ctx.fillStyle = 'gray'
          //     closeAreasId.map(v => v.area).slice().map(v => {
          //       let startPoint = newNodes[v[0].line[0]]
          //       let fixStartPoint = {
          //         x: center.x + startPoint.x,
          //         y: center.y + startPoint.y,
          //       }
          //       let endPoint = newNodes[v[0].line[1]]
          //       let fixEndPoint = {
          //         x: center.x + endPoint.x,
          //         y: center.y + endPoint.y,
          //       }
          //       ctx.beginPath()
          //       ctx.moveTo2(fixStartPoint)
          //       ctx.lineTo2(fixEndPoint)
          //       v.slice(1).map(w => {
          //         endPoint = newNodes[w.line[1]]
          //         fixEndPoint = {
          //           x: center.x + endPoint.x,
          //           y: center.y + endPoint.y,
          //         }
          //         ctx.lineTo2(fixEndPoint)
          //       })
          //       ctx.closePath()
          //       ctx.fill()
          //     })
          //   }
          //   ctx.restore()
          // })

          ctx.restore()
        })

        if (showFill) {
          closeAreasId.map(s => s.area).map(v => {
            let fillPath = new Path2D()
            let startPoint = newNodes[v[0].line[0]]
            let endPoint = newNodes[v[0].line[1]]
            fillPath.moveTo2(startPoint)
            v.map(w => {
              let line = w.line
              let lineType = line[6]
              endPoint = newNodes[line[1]]
              switch (lineType) {
                case LineType.Line:
                  fillPath.lineTo2(endPoint)
                  break
                case LineType.Bezier3:
                  fillPath.bezierCurveTo2(newCtrlNodes[line[2]], newCtrlNodes[line[3]], endPoint)
                  break
                case LineType.Bezier2:
                  let cp: number = 0
                  if (line[2] !== -1) cp = line[2]
                  if (line[3] !== -1) cp = line[3]
                  fillPath.quadraticCurveTo2(newCtrlNodes[cp], endPoint)
                  break
              }
            })
            fillPathList.push({close: true, path: fillPath})
          })
        }
      }

      if (singLines.length && false) {
        for (let i = 0; i < paths.length - 1; i++) {
          let ip, a = 0, b = 0
          for (let j = i + 1; j < paths.length; j++) {
            let currentLine = paths[i]
            let nextLine = paths[j]
            let t = Math2.isIntersection2(currentLine, nextLine, nodes, ctrlNodes)
            // let lastPoint = (j === path.length - 1 ? nodes[path[j][1]] : nodes[path[j + 1][0]])
            // let t = Math2.isIntersection(nodes[path[i][0]], nodes[path[i + 1][0]], nodes[path[j][0]], lastPoint)
            if (t) {
              ip = t
              a = i
              b = j
            }
          }
          if (ip) {
            console.log('ip', ip, a, b)
            let fillPath = new Path2D()
            fillPath.moveTo2(ip.intersectsPoint);

            if (ip.startLine.type === LineType.Line) {
              // @ts-ignore
              fillPath.lineTo2(...ip.startLine.lines[0].slice(1));
            }
            if (ip.startLine.type === LineType.Bezier2) {
              // @ts-ignore
              fillPath.quadraticCurveTo2(...ip.startLine.lines[0].slice(1))
            }
            if (ip.startLine.type === LineType.Bezier3) {
              // @ts-ignore
              fillPath.bezierCurveTo2(...ip.startLine.lines[0].slice(1))
            }
            for (let t = a + 1; t <= b; t++) {
              let line = paths[t]
              let lineType = line[6]
              let startPoint = nodes[line[0]]
              let endPoint = nodes[line[1]]
              // console.log('t', t, lineType)
              if (t === b) {
                if (ip.endLine.type === LineType.Line) {
                  // @ts-ignore
                  fillPath.lineTo2(...ip.endLine.lines[0].slice(1));
                }
                if (ip.endLine.type === LineType.Bezier2) {
                  fillPath.quadraticCurveTo2(ip.endLine.lines[0][1], ip.endLine.lines[0][2])
                }
                if (ip.endLine.type === LineType.Bezier3) {
                  // @ts-ignore
                  fillPath.bezierCurveTo2(...ip.endLine.lines[0].slice(1))
                }
                break
              }
              switch (lineType) {
                case LineType.Line:
                  fillPath.lineTo2(endPoint)
                  break
                case LineType.Bezier3:
                  fillPath.bezierCurveTo2(ctrlNodes[line[2]], ctrlNodes[line[3]], endPoint)
                  break
                case LineType.Bezier2:
                  let cp: number = 0
                  if (line[2] !== -1) cp = line[2]
                  if (line[3] !== -1) cp = line[3]
                  fillPath.quadraticCurveTo2(ctrlNodes[cp], endPoint)
                  break
              }
            }
            fillPathList.push({close: true, path: fillPath})
          }
        }
      }

      paths.map(line => {
        let strokePath = new Path2D()
        let lineType = line[6]
        let startPoint = nodes[line[0]]
        let endPoint = nodes[line[1]]
        strokePath.moveTo2(startPoint)
        switch (lineType) {
          case LineType.Line:
            strokePath.lineTo2(endPoint)
            break
          case LineType.Bezier3:
            strokePath.bezierCurveTo2(ctrlNodes[line[2]], ctrlNodes[line[3]], endPoint)
            break
          case LineType.Bezier2:
            let cp: number = 0
            if (line[2] !== -1) cp = line[2]
            if (line[3] !== -1) cp = line[3]
            strokePath.quadraticCurveTo2(ctrlNodes[cp], endPoint)
            break
        }
        strokePathList.push({close: true, path: strokePath})
      })
    }

    // console.log('fillPathList',fillPathList)
    if (showTime) {
      console.timeEnd()
    }

    return {strokePathList, fillPathList}
  }
}