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
import {cloneDeep, eq, uniqueId} from "lodash"
import {convexHull} from "../utils/test";
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

  getCustomShapePath3(): {strokePathList: LinePath[], fillPathList: LinePath[]} {
    let showTime = true
    let showFill = false
    if (showTime) {
      console.time()
    }
    let strokePathList: LinePath[] = []
    let fillPathList: LinePath[] = []
    const {nodes, paths, ctrlNodes} = this._conf.penNetwork
    if (paths.length) {
      let singLines: PenNetworkLine[][] = []
      let anyLines: PenNetworkLine[] = []
      let selfIntersectionLines: PenNetworkLine[] = []
      let preLine = paths[0]
      let startIndex = 0
      let endIndex = 0
      // paths.slice(1).map((line, i) => {
      //   if (line[0] !== preLine[1]) {
      //     if (i == 0) {
      //       anyLines.push(preLine)
      //     }
      //     if (i + 1 - startIndex > 1) {
      //       singLines.push(paths.slice(startIndex, i + 1))
      //     }
      //     startIndex = i + 1
      //     anyLines.push(line)
      //   } else {
      //     endIndex = i + 1
      //   }
      //   preLine = line
      // })
      // if (endIndex - startIndex > 1) {
      //   singLines.push(paths.slice(startIndex, endIndex))
      // }

      // console.log('singLines', singLines)
      // console.log('anyLines', anyLines)
      if (anyLines.length || true) {
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
            let newLine: any = [line]
            lineMap.map(v => {
              // console.log('v',v)
              let lastLine = newLine[newLine.length - 1]
              newLine.pop()
              newLine = newLine.concat([[lastLine[0], v.index], [v.index, lastLine[1]]])
            })
            newPaths = newPaths.concat(newLine)
          } else {
            newPaths.push(line)
          }
        })

        let closeLines: any[] = []
        //筛选出终点没人连的
        closeLines = newPaths.filter((v, i) => {
          let r = newPaths.find((w, j) => ((v[0] === w[1] || v[0] === w[0]) && i !== j))
          let r2 = newPaths.find((w, j) => ((v[1] === w[1] || v[1] === w[0]) && i !== j))
          return r2 && r
        })
        let closeLinesWithId = closeLines.map((v, i) => ({id: i, line: v}))

        let closeAreas: any[][] = []

        const check = (lines: any[]) => {
          let listIndexStr = lines.map(v => v.id).sort((a, b) => a - b).join('')
          return closeAreas.find(w => w.map(w => w.id).sort((a, b) => a - b).join('') === listIndexStr)
        }

        let visited: number[] = []
        const gg = (start: number, end: number, line: any, list: any[], save: any[]) => {
          visited.push(line.id)
          let arrsEnd = list.filter(w => [w.line[0], w.line[1]].includes(end) && w.id !== line.id)
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
                a.line = [line[1], end]
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
              arrsEnd = list.filter(w => [w.line[0], w.line[1]].includes(end) && w.id !== a.id)
            } else {
              for (let i = 0; i < arrsEnd.length; i++) {
                let newSave = save.slice()
                let a = cloneDeep(arrsEnd[i])
                let newEnd = -1
                if (a.line[0] === end) {
                  newEnd = a.line[1]
                } else {
                  newEnd = a.line[0]
                  a.line = [a.line[1], newEnd]
                }
                newSave.push(a)
                let isCloseIndex = newSave.findIndex(b => b.line[0] === newEnd)
                if (isCloseIndex > -1) {
                  let closeArea = newSave.slice(isCloseIndex)
                  if (!check(closeArea)) {
                    closeAreas = closeAreas.concat([closeArea])
                  }
                } else if (newEnd === start) {
                  if (!check(newSave)) {
                    closeAreas = closeAreas.concat([newSave])
                  }
                } else {
                  let r = gg(start, newEnd, a, list, newSave)
                  if (r.length) {
                    if (!check(r[0])) {
                      closeAreas = closeAreas.concat(r)
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
            if (!visited.includes(currentLine.id)){
              let start = currentLine.line[0]
              let end = currentLine.line[1]
              let r = gg(start, end, currentLine, closeLinesWithId.slice(), [currentLine])
              if (r.length) {
                if (!check(r[0])) {
                  closeAreas = closeAreas.concat(r)
                }
              }
            }
          })

          let closeAreasId = closeAreas.map((v, i) => ({id: i, area: v}))
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
          console.log('lineMaps', cloneDeep(lineMaps))
          console.log('newPaths', cloneDeep(newPaths))
          console.log('closeLines', cloneDeep(closeLines))
          // console.log('closeLinesWithId', cloneDeep(closeLinesWithId))
          console.log('closeAreasRepeat----', cloneDeep(closeAreas))
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

            if (showFill) {
              ctx.fillStyle = 'gray'
              closeAreas.slice().map(v => {
                let startPoint = newNodes[v[0].line[0]]
                let fixStartPoint = {
                  x: center.x + startPoint.x,
                  y: center.y + startPoint.y,
                }
                let endPoint = newNodes[v[0].line[1]]
                let fixEndPoint = {
                  x: center.x + endPoint.x,
                  y: center.y + endPoint.y,
                }
                ctx.beginPath()
                ctx.moveTo2(fixStartPoint)
                ctx.lineTo2(fixEndPoint)
                v.slice(1).map(w => {
                  endPoint = newNodes[w.line[1]]
                  fixEndPoint = {
                    x: center.x + endPoint.x,
                    y: center.y + endPoint.y,
                  }
                  ctx.lineTo2(fixEndPoint)
                })
                ctx.closePath()
                ctx.fill()
              })
            }
            ctx.restore()
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

      // let ps = []
      // for (let i = 0; i < paths.length - 1; i++) {
      //   for (let j = i; j < paths.length; j++) {
      //     let currentLine = paths[i]
      //     let nextLine = paths[j]
      //     let t = Math2.isIntersection2(currentLine, nextLine, nodes, ctrlNodes)
      //     if (t) {
      //       console.log('t', t)
      //       ps.push({
      //         p: t.intersectsPoint,
      //         is: [i, j]
      //       })
      //     }
      //   }
      // }
      //
      // console.log('ps', JSON.stringify(ps, null, 2))
      // let cu = CanvasUtil2.getInstance()
      // let {ctx} = cu
      // ctx.save()
      // ctx.strokeStyle = 'gray'
      // ctx.fillStyle = 'gray'
      //
      // const test = (lineIndex: number, list: any[]) => {
      //   let rIndex = list.findIndex(v => {
      //     return v.is.includes(lineIndex)
      //   })
      //   if (rIndex !== -1) {
      //     let item = list[rIndex]
      //     ctx.lineTo2(item.p)
      //     console.log('uite.p', item.p)
      //     list.splice(rIndex, 1)
      //     let i = 0
      //     if (item.is[0] === lineIndex) {
      //       i = 1
      //     }
      //     test(item.is[i], list)
      //   }
      // }
      //
      // ctx.moveTo2(ps[0].p)
      // // ps.shift()
      // test(ps[0].is[0], ps)
      //
      // ctx.stroke()
      // ctx.fill()
      // ctx.restore()

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
    if (showTime) {
      console.timeEnd()
    }

    return {strokePathList, fillPathList}
  }
}