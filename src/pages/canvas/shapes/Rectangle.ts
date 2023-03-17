import {BaseShape} from "./BaseShape"
import CanvasUtil2 from "../CanvasUtil2"
import {
  BaseEvent2,
  BezierPoint,
  BezierPointType,
  getP2,
  LineType,
  MouseOptionType,
  P,
  P2,
  ShapeStatus,
  ShapeType,
  StrokeAlign
} from "../utils/type"
import {Colors, defaultConfig} from "../utils/constant"
import {BaseConfig, Rect} from "../config/BaseConfig"
import draw from "../utils/draw"
import helper from "../utils/helper"
import {cloneDeep} from "lodash"
import {getRotatedPoint} from "../../../utils"

enum EditType {
  line = 'line',
  point = 'point',
  centerPoint = 'centerPoint',
}

export class Rectangle extends BaseShape {
  //最小拖动圆角。真实圆角可能为0，导致渲染的控制点和角重合，所以设置一个最小圆角
  minDragRadius = 15
  hoverPointIndex: number = -1
  enterPointIndex: number = -1
  rectHoverType: MouseOptionType = MouseOptionType.None
  rectEnterType: MouseOptionType = MouseOptionType.None
  //编辑模式下，hover在线段上时，临时绘制的控制点
  hoverLineIndex: number = -1
  enterLineIndex: number = -1
  hoverLineCenterPointIndex: number = -1
  enterLineCenterPointIndex: number = -1
  hoverLineCenterPoint: P = {x: 0, y: 0}
  editHover = {
    type: EditType.line,
    baseIndex: -1,
    index: -1,
  }
  editEnter = {
    type: EditType.line,
    baseIndex: -1,
    index: -1,
  }

  constructor(props: any) {
    super(props)
    // if (props.id === 'e378e9bc-080a-46ab-b184-ce86647aca9e') {
    if (false) {
      let event: BaseEvent2 = {
        capture: false,
        e: {} as any,
        point: {x: 0, y: 0},
        screenPoint: {x: 0, y: 0},
        canvasPoint: {x: 0, y: 0},
        type: '',
        stopPropagation() {
          this.capture = true
        },
        cancelStopPropagation() {
          this.capture = false
        }
      }
      this._dblclick(event)
    }
  }

  get _config(): BaseConfig {
    return this.conf as any
  }

  set _config(val) {
    this.conf = val
  }

  onDbClick(event: BaseEvent2, parents: BaseShape[]): boolean {
    let cu = CanvasUtil2.getInstance()
    if (this.status === ShapeStatus.Edit) {
      this.status = ShapeStatus.Select
      cu.editShape = undefined
      cu.mode = ShapeType.SELECT
    } else {
      if (!this._config.isCustom) {
        let {w, h} = this._config.layout
        //这里的xy这样设置是因为，渲染时的起点是center
        let x = -w / 2, y = -h / 2
        let bezierCps: BezierPoint[] = []
        bezierCps.push({
          cp1: getP2(),
          center: {...getP2(true), x: x, y: y},
          cp2: getP2(),
          type: BezierPointType.RightAngle
        })
        bezierCps.push({
          cp1: getP2(),
          center: {...getP2(true), x: x + w, y: y},
          cp2: getP2(),
          type: BezierPointType.RightAngle
        })
        bezierCps.push({
          cp1: getP2(),
          center: {...getP2(true), x: x + w, y: y + h},
          cp2: getP2(),
          type: BezierPointType.RightAngle
        })
        bezierCps.push({
          cp1: getP2(),
          center: {...getP2(true), x: x, y: y + h},
          cp2: getP2(),
          type: BezierPointType.RightAngle
        })
        this._config.lineShapes = [bezierCps]
      }
      this.status = ShapeStatus.Edit
      cu.editShape = this
      cu.mode = ShapeType.EDIT
    }
    return false
  }

  onMouseDown(event: BaseEvent2, parents: BaseShape[]) {
    // console.log('childMouseDown', this.editHover)
    if (this.status === ShapeStatus.Edit) {
      if (this.editHover.index !== -1) {
        if (this.editHover.type === EditType.centerPoint) {
          console.log('onMouseDown-hoverLineCenterPointIndex')
          this.editEnter = cloneDeep(this.editHover)
          this._config.lineShapes[this.editEnter.baseIndex].splice(this.editEnter.index, 0, {
            cp1: getP2(),
            center: {...getP2(true), ...this.hoverLineCenterPoint},
            cp2: getP2(),
            type: BezierPointType.RightAngle
          })
          // this.editEnter.index += 1
          this.editHover.index = -1
          this._config.isCustom = true
          CanvasUtil2.getInstance().render()
          return true
        }

        if (this.editHover.type === EditType.line || this.editHover.type === EditType.point) {
          this.editEnter = cloneDeep(this.editHover)
          this.editHover.index = -1
          this._config.isCustom = true
          return true
        }
      }
    }
    this.rectEnterType = this.rectHoverType
    return false
  }

  onMouseMove(event: BaseEvent2, parents: BaseShape[]) {
    // console.log('childMouseMove', this.editEnter)
    if (this.status === ShapeStatus.Edit) {
      if (this.editEnter.index !== -1) {
        let {center, realRotation} = this._config
        //TODO 是否可以统一反转？
        //反转到0度，好判断
        if (realRotation) {
          event.point = getRotatedPoint(event.point, center, -realRotation)
        }
        if (this.editEnter.type === EditType.point || this.editEnter.type === EditType.centerPoint) {

          this._config.lineShapes[this.editEnter.baseIndex][this.editEnter.index].center = {
            ...getP2(true), ...{
              x: event.point.x - center.x,
              y: event.point.y - center.y
            }
          }
          CanvasUtil2.getInstance().render()
          return true
        }

        if (this.editHover.type === EditType.line) {
          console.log('onMouseMove-enterLineIndex')
          let cu = CanvasUtil2.getInstance()
          let {x, y} = event.point
          let dx = x - cu.fixMouseStart.x
          let dy = y - cu.fixMouseStart.y
          console.log('dx', dx, 'dy', dy)
          let oldLine1Point = this.original.lineShapes[this.editEnter.baseIndex][this.editEnter.index]
          this._config.lineShapes[this.editEnter.baseIndex][this.editEnter.index].center.x = oldLine1Point.center.x + dx
          this._config.lineShapes[this.editEnter.baseIndex][this.editEnter.index].center.y = oldLine1Point.center.y + dy
          let previousPoint: BezierPoint
          let oldPreviousPoint: BezierPoint
          if (this.editEnter.index === 0) {
            let length = this._config.lineShapes[this.editEnter.baseIndex].length
            previousPoint = this._config.lineShapes[this.editEnter.baseIndex][length - 1]
            oldPreviousPoint = this.original.lineShapes[this.editEnter.baseIndex][length - 1]
          } else {
            previousPoint = this._config.lineShapes[this.editEnter.baseIndex][this.editEnter.index - 1]
            oldPreviousPoint = this.original.lineShapes[this.editEnter.baseIndex][this.editEnter.index - 1]
          }
          previousPoint.center.x = oldPreviousPoint.center.x + dx
          previousPoint.center.y = oldPreviousPoint.center.y + dy
          cu.render()
          return true
        }
      }
    }
    switch (this.rectEnterType) {
      case MouseOptionType.TopRight:
        this.dragRd1(event.point)
        return true
    }
    return false
  }

  onMouseUp(event: BaseEvent2, parents: BaseShape[]) {
    // console.log('childMouseUp')
    this.rectEnterType = this.rectHoverType = MouseOptionType.None
    this.enterPointIndex = this.hoverPointIndex = -1
    this.enterLineIndex = this.hoverLineIndex = -1
    this.enterLineCenterPointIndex = this.hoverLineCenterPointIndex = -1
    this.editHover = {
      type: EditType.line,
      baseIndex: -1,
      index: -1,
    }
    this.editEnter = cloneDeep(this.editHover)
    return false
  }

  beforeIsInShape() {
    return false
  }

  beforeEvent(event: BaseEvent2) {
    if (this.editEnter.index > -1) {
      event.stopPropagation()
      super.emit(event, [])
      return true
    }
    return false
  }

  isInShapeOnSelect(mousePoint: P, cu: CanvasUtil2): boolean {
    const {x, y} = mousePoint
    const {radius, box} = this.conf
    const {leftX, rightX, topY, bottomY,} = box
    let rr = 5 / cu.handScale

    let r = Math.max(radius, this.minDragRadius)
    //左上，拉动圆角那个点
    if ((leftX! + r - rr < x && x < leftX! + r + rr / 2) &&
      (topY! + r - rr < y && y < topY! + r + rr / 2)
    ) {
      this.rectHoverType = MouseOptionType.TopRight
      document.body.style.cursor = "pointer"
      return true
    }
    return false
  }

  isInShape(mousePoint: P, cu: CanvasUtil2): boolean {
    if (this.status === ShapeStatus.Edit) {
      let {center, lineShapes} = this._config
      this.hoverPointIndex = -1

      let fixMousePoint = {
        x: mousePoint.x - center.x,
        y: mousePoint.y - center.y
      }
      //用于判断是否与之前保存的值不同，仅在不同时才重绘
      let tempHoverLineIndex = -1
      let tempHoverLineCenterPointIndex = -1
      //用于跳出外层的for循环。hover到了任一目标上时，就不需要再去判断了
      let isBreak = false
      for (let index = 0; index < lineShapes.length; index++) {
        let lineShape = lineShapes[index]
        this.editHover.baseIndex = index
        for (let j = 0; j < lineShape.length; j++) {
          let currentPoint = lineShape[j]
          if (helper.isInPoint(fixMousePoint, currentPoint.center, 4)) {
            document.body.style.cursor = "pointer"
            this.hoverPointIndex = index
            this.editHover.type = EditType.point
            this.editHover.index = j
            return true
          }
          let previousPoint: BezierPoint
          if (j === 0) {
            previousPoint = lineShape[lineShape.length - 1]
          } else {
            previousPoint = lineShape[j - 1]
          }
          let line: any = [previousPoint.center, currentPoint.center]
          if (helper.isInLine(fixMousePoint, line)) {
            this.editHover.type = EditType.line
            document.body.style.cursor = "pointer"
            tempHoverLineIndex = j
            this.hoverLineCenterPoint = helper.getCenterPoint(previousPoint.center, currentPoint.center)
            if (helper.isInPoint(fixMousePoint, this.hoverLineCenterPoint, 4)) {
              this.editHover.type = EditType.centerPoint
              console.log('hover在线的中点上')
              document.body.style.cursor = "pointer"
              tempHoverLineCenterPointIndex = j
            }
            isBreak = true
            break
          }
        }
        if (isBreak) break
      }

      //仅hover在线中点上时，才重绘
      if (this.editHover.type === EditType.centerPoint && this.editHover.index !== tempHoverLineCenterPointIndex) {
        this.editHover.index = tempHoverLineCenterPointIndex
        CanvasUtil2.getInstance().render()
        return true
      }

      //仅hover在线上时，才重绘
      if (this.editHover.type === EditType.line && this.editHover.index !== tempHoverLineIndex) {
        this.editHover.index = tempHoverLineIndex
        CanvasUtil2.getInstance().render()
        return true
      }

      // //仅hover在线中点上时，才重绘
      // if (this.hoverLineCenterPointIndex !== tempHoverLineCenterPointIndex) {
      //   this.hoverLineCenterPointIndex = tempHoverLineCenterPointIndex
      //   CanvasUtil2.getInstance().render()
      //   return true
      // }
      // //仅hover在线上时，才重绘
      // if (this.hoverLineIndex !== tempHoverLineIndex) {
      //   this.hoverLineIndex = tempHoverLineIndex
      //   CanvasUtil2.getInstance().render()
      //   return true
      // }

      //hover在线上时，消费事件。不然会把cursor = "default"
      if (tempHoverLineIndex !== -1) {
        return true
      }

      document.body.style.cursor = "default"
    }
    return helper.isInBox(mousePoint, this.conf.box)
  }

  drawShape(ctx: CanvasRenderingContext2D, layout: Rect, parent?: BaseConfig) {
    if (this.status === ShapeStatus.Edit) return
    let {
      radius,
      fillColor, borderColor, lineWidth, strokeAlign
    } = this.conf
    let {x, y, w, h} = layout

    ctx.lineWidth = lineWidth ?? defaultConfig.lineWidth

    //填充图形
    ctx.fillStyle = fillColor
    let path = this.getShapePath(layout, this.conf.radius)
    ctx.fill(path)

    //描边
    let lw2 = ctx.lineWidth / 2
    if (strokeAlign === StrokeAlign.INSIDE) {
      x += lw2, y += lw2, w -= lw2 * 2, h -= lw2 * 2, radius -= lw2
    } else if (strokeAlign === StrokeAlign.OUTSIDE) {
      x -= lw2, y -= lw2, w += lw2 * 2, h += lw2 * 2, radius += lw2
    }
    ctx.strokeStyle = borderColor
    let path2 = this.getShapePath({x, y, w, h}, radius)
    ctx.stroke(path2)
  }

  drawHover(ctx: CanvasRenderingContext2D, layout: Rect): void {
    ctx.strokeStyle = defaultConfig.strokeStyle
    //容器hover时只需要描边矩形就行了
    let path = this.getShapePath(layout, 0)
    // let path = this.getShapePath(ctx, newLayout, this.conf.radius)
    ctx.stroke(path)
  }

  drawSelected(ctx: CanvasRenderingContext2D, layout: Rect): void {
    draw.selected(ctx, layout)
  }

  drawSelectedHover(ctx: CanvasRenderingContext2D, layout: Rect): void {
    if (this._config.isCustom) return
    // console.log('drawSelectedHover')
    let {x, y, w, h} = layout
    let {radius,} = this.conf
    ctx.strokeStyle = defaultConfig.strokeStyle
    ctx.fillStyle = Colors.White

    let cu = CanvasUtil2.getInstance()
    let r = Math.max(radius, this.minDragRadius)
    //当拖动时，圆角需要可以渲染到0
    if (this.rectEnterType) {
      r = radius
    }
    let r2 = 5 / cu.handScale
    let topLeft = {
      x: x + r,
      y: y + r,
    }
    let topRight = {
      x: x + w - r,
      y: y + r,
    }
    let bottomLeft = {
      x: x + r,
      y: y + h - r,
    }
    let bottomRight = {
      x: x + w - r,
      y: y + h - r,
    }
    draw.round2(ctx, topLeft, r2,)
    draw.round2(ctx, topRight, r2,)
    draw.round2(ctx, bottomLeft, r2,)
    draw.round2(ctx, bottomRight, r2,)
  }

  drawEdit(ctx: CanvasRenderingContext2D, layout: Rect): void {
    // this.log('drawEdit')
    let {
      fillColor,
      center
    } = this.conf

    ctx.save()

    ctx.strokeStyle = Colors.Line2
    ctx.fillStyle = fillColor

    let path = super.getCustomShapePath()
    ctx.fill(path)
    ctx.stroke(path)

    let bezierCps = this._config.lineShapes
    bezierCps.map(line => {
      line.map((currentPoint) => {
        draw.drawRound(ctx, currentPoint.center)
        if (currentPoint.cp1.use) draw.controlPoint(ctx, currentPoint.cp1, currentPoint.center)
        if (currentPoint.cp2.use) draw.controlPoint(ctx, currentPoint.cp2, currentPoint.center)
      })
    })
    // if (this.hoverLineIndex > -1 || this.hoverLineCenterPointIndex > -1) {
    //   draw.drawRound(ctx, this.hoverLineCenterPoint)
    // }
    if ((this.editHover.type === EditType.line
        || this.editHover.type === EditType.centerPoint)
      && this.editHover.index !== -1
    ) {
      draw.drawRound(ctx, this.hoverLineCenterPoint)
    }
    ctx.restore()
  }

  //拖动左上，改变圆角按钮
  // todo 当水平翻转的时候不行
  dragRd1(point: P) {
    // console.log('th.enterRd1')
    let {w, h} = this.conf.layout
    let {x, y} = point
    let cu = CanvasUtil2.getInstance()
    let dx = (x - cu.mouseStart.x)
    if (this.original.radius < this.minDragRadius) {
      dx += this.minDragRadius
    }
    this.conf.radius = this.original.radius + dx
    if (this.conf.radius < 0) {
      this.conf.radius = 0
    }
    let maxRadius = Math.min(w / 2, h / 2)
    if (this.conf.radius > maxRadius) {
      this.conf.radius = maxRadius
    }
    this.conf.radius = this.conf.radius.toFixed2()
    cu.render()
  }

  getShapePath(layout: Rect, r: number): Path2D {
    let {x, y, w, h} = layout
    let path = new Path2D()
    if (this._config.isCustom) {
      return super.getCustomShapePath()
    }
    if (r > 0) {
      let w2 = w / 2, h2 = h / 2
      path.moveTo(x + w2, y)
      path.arcTo(x + w, y, x + w, y + h2, r)
      path.arcTo(x + w, y + h, x + w2, y + h, r)
      path.arcTo(x, y + h, x, y + h2, r)
      path.arcTo(x, y, x + w2, y, r)
    } else {
      path.rect(x, y, w, h)
    }
    path.closePath()
    return path
  }

  getPointRelativeToCenter(target: P2 | P, center: P): P2 {
    return {
      ...getP2(true),
      x: target.x - center.x,
      y: target.y - center.y,
    }
  }

}