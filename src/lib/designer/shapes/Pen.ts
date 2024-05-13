import CanvasUtil, {CU} from "../engine/CanvasUtil"
import {BaseConfig, Rect} from "../config/BaseConfig"
import helper from "../utils/helper"
import {Colors, defaultConfig} from "../utils/constant"
import draw from "../utils/draw"
import {ParentShape} from "./core/ParentShape";
import {BaseEvent2, EditType, LineType, P, ShapeStatus, ShapeType} from "../types/type"
import {BaseShape} from "./core/BaseShape"
import {PenConfig, PenNetworkLine, PenNetworkNode, TempLine} from "../config/PenConfig"
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
      super.dispatch(event, [])
      return true
    }
    return false
  }

  beforeIsInShape(): boolean {
    return false
  }

  drawShape(ctx: CanvasRenderingContext2D, newLayout: Rect, parent?: BaseConfig): any {
    // console.log('Pen drawShape')
    if (this.status === ShapeStatus.Edit) return
    let {
      fillColor, lineWidth, borderColor, center
    } = this.conf
    // this.log('drawShape',)

    ctx.lineWidth = lineWidth ?? defaultConfig.lineWidth
    ctx.lineCap = "round"
    ctx.strokeStyle = borderColor
    ctx.fillStyle = fillColor

    this.getFillPath(ctx)

    let strokePath = this.getStrokePath()
    ctx.stroke(strokePath)

    // ctx.fill(fillPath, 'nonzero')
    // ctx.fill(fillPath, 'evenodd')

    //绘制所有点
    ctx.font = `400 18rem "SourceHanSansCN", sans-serif`
    ctx.fillStyle = 'red'
    this._conf.cache.nodes.map((point, i) => {
      ctx.fillText(i + '', point.x, point.y)
      // draw.drawRound(ctx, point)
    })
    this._conf.cache.ctrlNodes.map((point, i) => {
      draw.drawRound(ctx, point)
    })
  }

  drawHover(ctx: CanvasRenderingContext2D, newLayout: Rect): any {
    ctx.strokeStyle = defaultConfig.strokeStyle
    //容器hover时只需要描边矩形就行了
    let path = this.getStrokePath()
    ctx.stroke(path)
  }

  drawSelected(ctx: CanvasRenderingContext2D, newLayout: Rect): any {
    ctx.strokeStyle = defaultConfig.strokeStyle
    let strokePath = this.getStrokePath()
    ctx.stroke(strokePath)
    draw.selected(ctx, newLayout, this.conf.isPointOrLine)
  }

  drawEdit(ctx: CanvasRenderingContext2D, newLayout: Rect): any {
    // this.log('drawEdit',)
    let {
      fillColor
    } = this.conf

    ctx.strokeStyle = Colors.Line2
    ctx.fillStyle = fillColor

    this.getFillPath(ctx)

    let strokePath = this.getStrokePath()
    ctx.stroke(strokePath)

    const {nodes, paths, ctrlNodes} = this._conf.penNetwork

    //下面有同名变量，这里加个if条件，避免变量作用域的问题
    if (true) {
      //渲染hover在线上时，线段的中心点
      let {pointIndex, lineIndex, type} = this.editHover
      if (type === EditType.Point) {
        let currentPoint = nodes[pointIndex]
        draw.drawRound(ctx, currentPoint, 5)
      }
      if ((type === EditType.Line || type === EditType.CenterPoint) && lineIndex !== -1) {
        //TODO 提成统一方法
        let line = paths[lineIndex]
        let lineType = line[4]
        let startPoint = nodes[line[0]]
        let endPoint = nodes[line[1]]
        ctx.strokeStyle = Colors.Hover_Line
        ctx.moveTo2(startPoint)
        switch (lineType) {
          case LineType.Line:
            ctx.lineTo2(endPoint)
            break
          case LineType.Bezier3:
            ctx.bezierCurveTo2(ctrlNodes[line[2]], ctrlNodes[line[3]], endPoint)
            break
          case LineType.Bezier2:
            let cp: number = 0
            if (line[2] !== -1) cp = line[2]
            if (line[3] !== -1) cp = line[3]
            ctx.quadraticCurveTo2(ctrlNodes[cp], endPoint)
            break
        }
        ctx.stroke()
        draw.drawRound(ctx, this.editHover.lineCenterPoint)
      }
    }

    ctx.font = `400 18rem "SourceHanSansCN", sans-serif`
    ctx.fillStyle = 'red'
    //绘制所有点
    // this._conf.cache.nodes.map((point, i) => {
    nodes.map((point, i) => {
      // if (point.cp1.use) draw.controlPoint(ctx, point.cp1, point.center)
      // if (point.cp2.use) draw.controlPoint(ctx, point.cp2, point.center)
      draw.drawRound(ctx, point)
      ctx.fillText(i + '', point.x, point.y)
    })

    // console.log(' this.editStartPointInfo', this.editStartPointInfo)
    // console.log(' this.editHover', this.editHover)

    let {pointIndex, type} = this.editStartPointInfo
    //再绘制选中的当前点和控制点，之所以分开绘制，是因为遮盖问题
    if (type === EditType.Point || type === EditType.ControlPoint) {
      let currentPoint = nodes[pointIndex]
      //找到包含当前点的所有线条，如果其他线条是曲线，还需要显示对应的控制点
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
    }

    // console.log('this.tempPoint',this.tempPoint)
    if (this.tempPoint) {
      draw.currentPoint(ctx, this.tempPoint)
    }
  }

  isInShape(mousePoint: P, cu: CanvasUtil): boolean {
    return helper.isInBox(mousePoint, this.conf.box)
  }

  isInShapeOnSelect(p: P, cu: CanvasUtil): boolean {
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

  getPenNetwork() {
  }

  getFillPath(ctx: CanvasRenderingContext2D) {
    let showTime = false
    let showFill = true
    if (showTime) {
      console.time()
    }

    const drawCloseArea = (nodes: PenNetworkNode[], ctrlNodes: P[], closeAreas: any[]) => {
      if (showFill) {
        let newNodes = cloneDeep(nodes)
        let newCtrlNodes = cloneDeep(ctrlNodes)
        closeAreas.map((v: any []) => {
          let startPoint = newNodes[v[0].line[0]]
          let endPoint = newNodes[v[0].line[1]]
          let path = new Path2D()
          path.moveTo2(startPoint)
          // console.log('v', startPoint, JSON.stringify(v.map(a => a.line)))
          v.map((w: any) => {
            let line = w.line
            let lineType = line[4]
            endPoint = newNodes[line[1]]
            switch (lineType) {
              case LineType.Line:
                path.lineTo2(endPoint)
                break
              case LineType.Bezier3:
                // console.log('newCtrlNodes[line[2]]',newCtrlNodes[line[2]])
                // console.log('newCtrlNodes[line[3]]',newCtrlNodes[line[3]])
                // console.log('endPoint',endPoint)
                path.bezierCurveTo2(newCtrlNodes[line[2]], newCtrlNodes[line[3]], endPoint)
                break
              case LineType.Bezier2:
                let cp: number = 0
                if (line[2] !== -1) cp = line[2]
                if (line[3] !== -1) cp = line[3]
                path.quadraticCurveTo2(newCtrlNodes[cp], endPoint)
                break
            }
          })
          // path.closePath()
          ctx.fill(path)
        })
      }
    }

    if (this.conf.isCache && false) {
      const {nodes, paths, ctrlNodes, areas: closeAreasId = []} = this._conf.cache
      drawCloseArea(nodes, ctrlNodes, closeAreasId)
    } else {
      this.checkAcr()
      const {nodes, paths, ctrlNodes} = this._conf.cache
      if (paths.length) {
        //TODO 有空了记得渲染三次自相交的图
        let selfIntersectionLines: PenNetworkLine[] = []

        let newNodes = cloneDeep(nodes)
        let newCtrlNodes = cloneDeep(ctrlNodes)
        let lineMaps = new Map<number, any[]>()

        //查找交点，并将交点记录到对应的线段上
        //TODO 如果线与线的连接点正好在另一条线上，那么这里判断不出来
        for (let i = 0; i < paths.length - 1; i++) {
          let currentLine = paths[i]
          let p1 = nodes[currentLine[0]],
            p2 = nodes[currentLine[1]],
            line1Type = currentLine[4]
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

        // console.log('lineMaps', lineMaps)

        //将有交点的线段分割
        let newPaths: PenNetworkLine[] = []
        paths.map((line: PenNetworkLine, index) => {
          let lineMap = lineMaps.get(index)
          if (lineMap) {
            lineMap.sort((a, b) => {
              return a.t - b.t
            })
            let lineType = line[4]
            if (lineType === LineType.Line) {
              let newLines: PenNetworkLine[] = [line]
              lineMap.map(v => {
                // console.log('v',v)
                let lastLine = newLines[newLines.length - 1]
                newLines.pop()
                newLines = newLines.concat([
                  [lastLine[0], v.index, -1, -1, lineType],
                  [v.index, lastLine[1], -1, -1, lineType]
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
              let newLines: PenNetworkLine[] = [line]
              lineMap.map(v => {
                // console.log('v',v)
                let lastLine = newLines[newLines.length - 1]
                newLines.pop()
                let split = splitCurve!.split(v.t)
                let leftPoints = split.left.points
                let newLine: PenNetworkLine = [0, 0, 0, 0, LineType.Line]
                if (leftPoints.length === 3) {
                  newCtrlNodes.push(leftPoints[1])
                  newLine = [lastLine[0], v.index, newCtrlNodes.length - 1, -1, lineType]
                } else {
                  newCtrlNodes.push(leftPoints[1])
                  newCtrlNodes.push(leftPoints[2])
                  newLine = [lastLine[0], v.index, newCtrlNodes.length - 2, newCtrlNodes.length - 1, lineType]
                }

                splitCurve = split.right
                let rightPoints = split.right.points
                let rightNewLine: PenNetworkLine = [0, 0, 0, 0, LineType.Line]
                if (rightPoints.length === 3) {
                  newCtrlNodes.push(rightPoints[1])
                  rightNewLine = [v.index, lastLine[1], newCtrlNodes.length - 1, -1, lineType]
                } else {
                  newCtrlNodes.push(rightPoints[1])
                  newCtrlNodes.push(rightPoints[2])
                  rightNewLine = [v.index, lastLine[1], newCtrlNodes.length - 2, newCtrlNodes.length - 1, lineType]
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

        // console.log('newPaths', newPaths)

        let lastTemp = []
        let closeLines: PenNetworkLine[] = newPaths
        //筛选掉终点没人连的，可能存在N条线段一直连着，但不形成闭合。一次筛选筛不完整
        while (closeLines.length !== lastTemp.length) {
          lastTemp = cloneDeep(closeLines)
          closeLines = closeLines.filter((v, i) => {
            let r = closeLines.find((w, j) => ((v[0] === w[1] || v[0] === w[0]) && i !== j))
            let r2 = closeLines.find((w, j) => ((v[1] === w[1] || v[1] === w[0]) && i !== j))
            return r2 && r
          })
        }

        // console.log('closeLines', closeLines)
        // console.log(newNodes)

        let closeLinesWithId: TempLine[] = closeLines.map((v, i) => ({id: i, line: v}))
        // console.log('closeLinesWithId', closeLinesWithId)

        //寻找封闭图
        //参考：https://www.zhihu.com/question/47044473
        let c = 0
        const fn = (start: number, end: number, currentLine: TempLine, array: TempLine[], save: TempLine[]): TempLine[] => {
          // c++
          // if (c > 6) return []
          let startPoint1 = currentLine.line[0]
          let endPoint1 = currentLine.line[1]
          let containEndPointLines = array.filter((w, i) => w.line.slice(0, 2).includes(endPoint1) && w.id !== currentLine.id)
          let lastD = Infinity
          let l: TempLine
          containEndPointLines.map(a => {
            let end
            let line = a.line
            if (line[0] === endPoint1) {
              end = line[1]
            } else {
              end = line[0]
              //交换顺序
              a.line[0] = a.line[1]
              a.line[1] = end
              if (a.line[4] !== LineType.Line) {
                let temp = a.line[2]
                a.line[2] = a.line[3]
                a.line[3] = temp
              }
            }
            // 计算角度
            let d = Math2.getDegree(newNodes[endPoint1], newNodes[end], newNodes[startPoint1])
            // console.log('d', d, currentLine.line, line, startPoint1, endPoint1, end)
            if (d < lastD) {
              lastD = d
              l = cloneDeep(a)
            }
          })
          // console.log('c', containEndPointLines, l)
          // @ts-ignore
          if (l) {
            //此处是针对，一条线段同时连接两个闭合图形的特殊情况
            let r = save.find(v => v.id === l.id)
            if (r) return []

            save.push(l)
            if (l.line[1] === start) {
              return save
            }
            return fn(start, end, l, array, save)
          }
          return []
        }

        let closeAreas: any[] = []

        //检测封闭图形是否重复
        const checkCloseAreaRepeat = (lines: TempLine[]) => {
          let listIndexStr = lines.map(v => v.id).sort((a, b) => a - b).join('')
          return closeAreas.find(w => w.map((x: any) => x.id).sort((a: any, b: any) => a - b).join('') === listIndexStr)
        }

        //TODO 想想，如果只有两条直线，那么根本无需检测，肯定没有封闭图。如果是曲线呢？
        if (closeLinesWithId.length >= 2 && true) {
          closeLinesWithId.map((currentLine, i, array) => {
            let startIndex = currentLine.line[0]
            let endIndex = currentLine.line[1]
            let r = fn(startIndex, endIndex, currentLine, array.slice(), [cloneDeep(currentLine)])
            if (r.length && !checkCloseAreaRepeat(r)) {
              closeAreas.push(r)
            }
          })
          // console.log('closeAreas 长度', closeAreas.length)

          closeAreas.map(v => {
            // console.log(JSON.stringify(v.map(a => a.line)))
          })

          drawCloseArea(newNodes, newCtrlNodes, closeAreas)

          this.conf.cache.nodes = newNodes
          this.conf.cache.paths = newPaths
          this.conf.cache.ctrlNodes = newCtrlNodes
          this.conf.cache.areas = closeAreas
          this.conf.isCache = true
        }
      }
    }

    if (showTime) {
      console.timeEnd()
    }
  }

  getFillPath_old(ctx: CanvasRenderingContext2D) {
    let showTime = false
    let showFill = true
    if (showTime) {
      console.time()
    }

    const drawFillArea = (nodes: PenNetworkNode[], ctrlNodes: P[], closeAreasId: any[]) => {
      if (showFill) {
        let newNodes = cloneDeep(nodes)
        let newCtrlNodes = cloneDeep(ctrlNodes)
        closeAreasId.map(s => s.area).map((v: any []) => {
          let startPoint = newNodes[v[0].line[0]]
          let endPoint = newNodes[v[0].line[1]]
          let path = new Path2D()
          path.moveTo2(startPoint)
          // console.log('v', startPoint, JSON.stringify(v.map(a => a.line)))
          v.map((w: any) => {
            let line = w.line
            let lineType = line[4]
            endPoint = newNodes[line[1]]
            switch (lineType) {
              case LineType.Line:
                path.lineTo2(endPoint)
                break
              case LineType.Bezier3:
                // console.log('newCtrlNodes[line[2]]',newCtrlNodes[line[2]])
                // console.log('newCtrlNodes[line[3]]',newCtrlNodes[line[3]])
                // console.log('endPoint',endPoint)
                path.bezierCurveTo2(newCtrlNodes[line[2]], newCtrlNodes[line[3]], endPoint)
                break
              case LineType.Bezier2:
                let cp: number = 0
                if (line[2] !== -1) cp = line[2]
                if (line[3] !== -1) cp = line[3]
                path.quadraticCurveTo2(newCtrlNodes[cp], endPoint)
                break
            }
          })
          // path.closePath()
          ctx.fill(path)
        })
      }
    }

    if (this.conf.isCache && false) {
      const {nodes, paths, ctrlNodes, areas: closeAreasId = []} = this._conf.cache
      drawFillArea(nodes, ctrlNodes, closeAreasId)
    } else {
      this.checkAcr()
      const {nodes, paths, ctrlNodes} = this._conf.cache
      if (paths.length) {
        //TODO 有空了记得渲染三次自相交的图
        let selfIntersectionLines: PenNetworkLine[] = []

        let newNodes = cloneDeep(nodes)
        let newCtrlNodes = cloneDeep(ctrlNodes)
        let lineMaps = new Map<number, any[]>()

        //查找交点，并将交点记录到对应的线段上
        for (let i = 0; i < paths.length - 1; i++) {
          let currentLine = paths[i]
          let p1 = nodes[currentLine[0]],
            p2 = nodes[currentLine[1]],
            line1Type = currentLine[4]
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

        console.log('lineMaps', lineMaps)

        //将有交点的线段分割
        let newPaths: any[] = []
        paths.map((line, index) => {
          let lineMap = lineMaps.get(index)
          if (lineMap) {
            lineMap.sort((a, b) => {
              return a.t - b.t
            })
            let lineType = line[4]
            if (lineType === LineType.Line) {
              let newLines: any = [line]
              lineMap.map(v => {
                // console.log('v',v)
                let lastLine = newLines[newLines.length - 1]
                newLines.pop()
                newLines = newLines.concat([
                  [lastLine[0], v.index, -1, -1, lineType],
                  [v.index, lastLine[1], -1, -1, lineType]
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
                  newLine = [lastLine[0], v.index, newCtrlNodes.length - 1, -1, lineType]
                } else {
                  newCtrlNodes.push(leftPoints[1])
                  newCtrlNodes.push(leftPoints[2])
                  newLine = [lastLine[0], v.index, newCtrlNodes.length - 2, newCtrlNodes.length - 1, lineType]
                }

                splitCurve = split.right
                let rightPoints = split.right.points
                let rightNewLine = []
                if (rightPoints.length === 3) {
                  newCtrlNodes.push(rightPoints[1])
                  rightNewLine = [v.index, lastLine[1], newCtrlNodes.length - 1, -1, lineType]
                } else {
                  newCtrlNodes.push(rightPoints[1])
                  newCtrlNodes.push(rightPoints[2])
                  rightNewLine = [v.index, lastLine[1], newCtrlNodes.length - 2, newCtrlNodes.length - 1, lineType]
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

        console.log('newPaths', newPaths)

        let closeLines: any[] = []
        //筛选掉终点没人连的
        closeLines = newPaths.filter((v, i) => {
          let r = newPaths.find((w, j) => ((v[0] === w[1] || v[0] === w[0]) && i !== j))
          let r2 = newPaths.find((w, j) => ((v[1] === w[1] || v[1] === w[0]) && i !== j))
          return r2 && r
        })

        console.log('closeLines', closeLines)

        let closeLinesWithId = closeLines.map((v, i) => ({id: i, line: v}))
        // console.log('closeLinesWithId', closeLinesWithId)

        let closeAreasRepeat: any[][] = []

        const check = (lines: any[]) => {
          let listIndexStr = lines.map(v => v.id).sort((a, b) => a - b).join('')
          return closeAreasRepeat.find(w => w.map(w => w.id).sort((a, b) => a - b).join('') === listIndexStr)
        }

        let visited: number[] = []
        let showLog = false

        //寻找封闭图
        //TODO 2024-02-06此方法会计算出太多的封闭图
        const findCloseArea = (start: number, end: number, line: any, list: any[], save: any[]) => {
          visited.push(line.id)
          //找出列表中，包含了当前线条end点的的其他线条
          let containEndPointLines = list.filter(w => w.line.slice(0, 2).includes(end) && w.id !== line.id)
          showLog && console.log('包含0', '当前：', line.line, 'save', JSON.stringify(save.map(v => v.line)), '包含', JSON.stringify(containEndPointLines.map(v => v.line)),)
          while (containEndPointLines.length !== 0) {
            if (containEndPointLines.length === 1) {
              //这里用复制一遍。因为后续的其他遍历，可能也会碰到这条线，然后方向是相反的，又去改变头和尾
              let a = cloneDeep(containEndPointLines[0])
              let line = a.line
              if (line[0] === end) {
                end = line[1]
              } else {
                end = line[0]
                //交换顺序
                a.line[0] = a.line[1]
                a.line[1] = end
                if (a.line[4] !== LineType.Line) {
                  let temp = a.line[2]
                  a.line[2] = a.line[3]
                  a.line[3] = temp
                }
              }
              save.push(a)
              if (end === start) {
                showLog && console.log(1, '当前：', line, 'save', JSON.stringify(save.map(v => v.line)))
                visited.push(a.id)
                return [save]
              }
              //如果当前线段与线段们中的任一组成了回路，那么就是一个新的封闭图
              let isCloseIndex = save.findIndex(b => b.line[0] === end)
              if (isCloseIndex > -1) {
                showLog && console.log(2, '当前：', line, 'save', JSON.stringify(save.map(v => v.line)))
                visited.push(a.id)
                return [save.slice(isCloseIndex)]
              }
              containEndPointLines = list.filter(w => w.line.slice(0, 2).includes(end) && w.id !== a.id)
              showLog && console.log('包含1', '当前：', line, 'save', JSON.stringify(save.map(v => v.line)), '包含', JSON.stringify(containEndPointLines.map(v => v.line)))
            } else {
              for (let i = 0; i < containEndPointLines.length; i++) {
                let newSave = save.slice()
                let a = cloneDeep(containEndPointLines[i])
                let newEnd = -1
                if (a.line[0] === end) {
                  newEnd = a.line[1]
                } else {
                  newEnd = a.line[0]
                  a.line[0] = a.line[1]
                  a.line[1] = newEnd
                  if (a.line[4] !== LineType.Line) {
                    let temp = a.line[2]
                    a.line[2] = a.line[3]
                    a.line[3] = temp
                  }
                }

                newSave.push(a)
                let isCloseIndex = newSave.findIndex(b => b.line[0] === newEnd)
                if (isCloseIndex > -1) {
                  let closeArea = newSave.slice(isCloseIndex)
                  if (!check(closeArea)) {
                    visited.push(a.id)
                    closeAreasRepeat = closeAreasRepeat.concat([closeArea])
                  }
                  showLog && console.log(3, '当前：', a.line, 'save', JSON.stringify(newSave.map(v => v.line)), '区域', closeAreasRepeat)
                } else if (newEnd === start) {
                  if (!check(newSave)) {
                    visited.push(a.id)
                    closeAreasRepeat = closeAreasRepeat.concat([newSave])
                  }
                  showLog && console.log(4, '当前：', a.line, 'save', JSON.stringify(newSave.map(v => v.line)), '区域', closeAreasRepeat)
                } else {
                  let r = findCloseArea(start, newEnd, a, list, newSave)
                  if (r.length) {
                    if (!check(r[0])) {
                      visited.push(a.id)
                      closeAreasRepeat = closeAreasRepeat.concat(r)
                    }
                  }
                  showLog && console.log(5, '当前：', a.line, 'save', JSON.stringify(newSave.map(v => v.line)), '区域', closeAreasRepeat)
                }
              }
              return []
            }
          }
          return []
        }

        //TODO 想想，如果只有两条直线，那么根本无需检测，肯定没有封闭图。如果是曲线呢？
        if (closeLinesWithId.length >= 2 && true) {
          closeLinesWithId.map((currentLine, index, array) => {
            if (!visited.includes(currentLine.id)) {
              let start = currentLine.line[0]
              let end = currentLine.line[1]
              let r = findCloseArea(start, end, currentLine, array.slice(), [currentLine])
              // console.log('r',r)
              if (r.length) {
                if (!check(r[0])) {
                  closeAreasRepeat = closeAreasRepeat.concat(r)
                }
              }
              // console.log('-----', r)
            }
          })

          // console.log('closeAreasRepeat', closeAreasRepeat)
          // closeAreasRepeat.map(v => {
          //   console.log(JSON.stringify(v.map(a => a.line)))
          // })
          let closeAreasId = closeAreasRepeat.map((v, i) => ({id: i, area: v}))
          closeAreasId.sort((a, b) => a.area.length - b.area.length)
          // console.log('closeAreasId', closeAreasId)
          let waitDelId: number[] = []

          //TODO　筛选重叠的图形
          //2024-02-02 当前的删除方式有问题，共用两条边以上的不一定重叠
          let test = true
          if (test) {
            closeAreasId.map((a, i, arr) => {
              if (waitDelId.includes(a.id)) return
              let aids = a.area.map((l: any) => l.id)
              let q: any[] = arr.slice(i + 1).filter((b: any, j: number) => {
                let count = 0
                let bids = b.area.map((l: any) => l.id)
                aids.map(id => {
                  if (bids.includes(id)) {
                    count++
                  }
                })
                return count >= 2
              })
              // console.log('aids', aids)
              // console.log('q', q)

              if (q.length) {
                if (a.area.length < q[0].area.length) {
                  waitDelId.push(a.id)
                }
              }
            })
            console.log('waitDelId', waitDelId)
            waitDelId.map(v1 => {
              let r = closeAreasId.findIndex(b => b.id === v1)
              if (r) {
                closeAreasId.splice(r, 1)
              }
            })
          }

          console.log('closeAreasId', closeAreasId)
          // closeAreasId.map(v => {
          //   console.log(JSON.stringify(v.area.map(a => a.line)))
          // })
          // console.log('visited', cloneDeep(Array.from(new Set(visited))))

          let cu = CanvasUtil.getInstance()
          let {ctx} = cu
          ctx.font = `400 18rem "SourceHanSansCN", sans-serif`
          newNodes.map((point, i) => {
            ctx.fillText(i + '', point.x, point.y)
            // draw.drawRound(ctx, point)
          })

          cu.waitRenderOtherStatusFunc.push(() => {
            ctx.save()
            draw.calcPosition(ctx, this.conf)
            ctx.strokeStyle = 'red'
            ctx.fillStyle = 'red'
            closeLinesWithId.map(line => {
              // let startPoint = newNodes[line.line[0]]
              // let endPoint = newNodes[line.line[1]]
              // ctx.moveTo2(startPoint)
              // ctx.lineTo2(endPoint)
              // cu.ctx.font = `400 16rem "SourceHanSansCN", sans-serif`
              // let a = helper.getStraightLineCenterPoint(startPoint, endPoint)
              // ctx.fillText(`${line.line[0]}-${line.line[1]}:${line.id}`, a.x - 20, a.y)
              // ctx.fillText(`${line.id}`, a.x, a.y)
            })
            // ctx.stroke()
            ctx.restore()
          })

          drawFillArea(newNodes, newCtrlNodes, closeAreasId)
          // drawFillArea(newNodes, newCtrlNodes, closeAreasId.slice(4, 5))

          this.conf.cache.nodes = newNodes
          this.conf.cache.paths = newPaths
          this.conf.cache.ctrlNodes = newCtrlNodes
          this.conf.cache.areas = closeAreasId
          this.conf.isCache = true
        }
      }
    }

    if (showTime) {
      console.timeEnd()
    }
  }

  getStrokePath() {
    const {nodes, paths, ctrlNodes} = this.conf.penNetwork
    // const {nodes, paths, ctrlNodes} = this.conf.cache
    let strokePath = new Path2D()
    paths.map(line => {
      let lineType = line[4]
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
    })
    return strokePath
  }

  toPen() {
    let cu = CU.i()
    let list = cu.children
    if (this.parent) {
      list = this.parent.children
    }
    let rIndex = list.findIndex(v => v.conf.id === this.conf.id)
    this.conf.type = ShapeType.PEN
    let ins = new Pen({conf: cloneDeep(this.conf), parent: this.parent})
    if (rIndex > -1) {
      list[rIndex] = ins
    }
    ins.status = ShapeStatus.Select
    return ins
  }
}