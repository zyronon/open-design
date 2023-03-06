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
  StrokeAlign
} from "../utils/type"
import {Colors, defaultConfig} from "../utils/constant"
import {BaseConfig, Rect} from "../config/BaseConfig"
import draw from "../utils/draw"

export class Rectangle extends BaseShape {

  //最小拖动圆角。真实圆角可能为0，导致渲染的控制点和角重合，所以设置一个最小圆角
  minDragRadius = 15
  hoverPointIndex: number = -1
  rectHoverType: MouseOptionType = MouseOptionType.None
  rectEnterType: MouseOptionType = MouseOptionType.None


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
      this.dblclick(event)
    }
  }

  get _config(): any {
    return this.conf as any
  }

  set _config(val) {
    this.conf = val
  }

  dbClickChild(event: BaseEvent2, parents: BaseShape[]): boolean {
    return false
  }

  mouseDownChild(event: BaseEvent2, parents: BaseShape[]) {
    // console.log('childMouseDown', this.hoverPointIndex)
    if (this.status === ShapeStatus.Edit) {
      this._config.isCustom = true
      this.enter = true
      return true
    }
    this.rectEnterType = this.rectHoverType
    return false
  }

  mouseMoveChild(event: BaseEvent2, parents: BaseShape[]) {
    // console.log('childMouseMove', this.hoverPointIndex)
    if (this.status === ShapeStatus.Edit) {
      if (this.hoverPointIndex < 0 || !this.enter) return false
      let {x, y,} = event.point
      let cu = CanvasUtil2.getInstance()
      // let {x, y, w, h, points} = this._config
      // mousePoint.x = mousePoint.x - x - w / 2
      // mousePoint.y = mousePoint.y - y - h / 2
      this._config.points[this.hoverPointIndex].center = {x, y}
      cu.render()
      return true
    }
    switch (this.rectEnterType) {
      case MouseOptionType.TopRight:
        this.dragRd1(event.point)
        return true
    }
    return false
  }

  mouseUpChild(event: BaseEvent2, parents: BaseShape[]) {
    this.rectEnterType = this.rectHoverType = MouseOptionType.None
    // console.log('childMouseUp', this.hoverPointIndex)
    return false
  }

  beforeIsInShape() {
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

  isInShapeChild(mousePoint: P, cu: CanvasUtil2): boolean {
    if (this.status === ShapeStatus.Edit) {
      let {x, y, w, h, points} = this._config
      this.hoverPointIndex = -1
      mousePoint.x = mousePoint.x - x - w / 2
      mousePoint.y = mousePoint.y - y - h / 2
      for (let i = 0; i < points.length; i++) {
        let p = points[i]
        if (super.isInPoint(mousePoint, p.center, 4)) {
          document.body.style.cursor = "pointer"
          this.hoverPointIndex = i
          return true
        }
      }
      document.body.style.cursor = "default"
    }
    return super.isInBox(mousePoint)
  }

  getShapePath(ctx: CanvasRenderingContext2D, layout: Rect, r: number) {
    let {x, y, w, h} = layout
    let path = new Path2D()
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

  drawShape(ctx: CanvasRenderingContext2D, layout: Rect, parent?: BaseConfig) {
    let {
      radius,
      fillColor, borderColor, lineWidth, strokeAlign
    } = this.conf
    let {x, y, w, h} = layout

    ctx.lineWidth = lineWidth ?? defaultConfig.lineWidth

    //填充图形
    ctx.fillStyle = fillColor
    let path = this.getShapePath(ctx, layout, this.conf.radius)
    ctx.fill(path)

    //描边
    let lw2 = ctx.lineWidth / 2
    if (strokeAlign === StrokeAlign.INSIDE) {
      x += lw2, y += lw2, w -= lw2 * 2, h -= lw2 * 2, radius -= lw2
    } else if (strokeAlign === StrokeAlign.OUTSIDE) {
      x -= lw2, y -= lw2, w += lw2 * 2, h += lw2 * 2, radius += lw2
    }
    ctx.strokeStyle = borderColor
    let path2 = this.getShapePath(ctx, {x, y, w, h}, radius)
    ctx.stroke(path2)

  }

  drawHover(ctx: CanvasRenderingContext2D, layout: Rect): void {
    ctx.strokeStyle = defaultConfig.strokeStyle
    //容器hover时只需要描边矩形就行了
    let path = this.getShapePath(ctx, layout, 0)
    // let path = this.getShapePath(ctx, newLayout, this.conf.radius)
    ctx.stroke(path)
  }

  drawSelected(ctx: CanvasRenderingContext2D, layout: Rect): void {
    draw.selected(ctx, layout)
  }

  drawSelectedHover(ctx: CanvasRenderingContext2D, layout: Rect): void {
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
    draw.round(ctx, topLeft, r2,)
    draw.round(ctx, topRight, r2,)
    draw.round(ctx, bottomLeft, r2,)
    draw.round(ctx, bottomRight, r2,)
  }

  drawEdit(ctx: CanvasRenderingContext2D, conf: BaseConfig): void {
    let {
      x, y, w, h, radius,
      fillColor, borderColor,
      type, flipVertical, flipHorizontal, children, points,
      isCustom
    } = conf
    let bezierCps: BezierPoint[] = []
    if (isCustom) {
      bezierCps = points
    } else {
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
      this.conf.points = bezierCps
    }

    ctx.save()

    ctx.strokeStyle = Colors.Line2
    ctx.fillStyle = fillColor
    ctx.beginPath()

    bezierCps.map((currentPoint: BezierPoint, index: number, array) => {
      let previousPoint: BezierPoint
      if (index === 0) {
        previousPoint = array[array.length - 1]
      } else {
        previousPoint = array[index - 1]
      }
      let lineType: LineType = LineType.Line
      if (
        currentPoint.type === BezierPointType.RightAngle &&
        previousPoint.type === BezierPointType.RightAngle
      ) {
        lineType = LineType.Line
      } else if (
        currentPoint.type !== BezierPointType.RightAngle &&
        previousPoint.type !== BezierPointType.RightAngle) {
        lineType = LineType.Bezier3
      } else {
        if (previousPoint.cp2.use || currentPoint.cp1.use) {
          lineType = LineType.Bezier2
        } else {
          lineType = LineType.Line
        }
      }
      switch (lineType) {
        case LineType.Line:
          // ctx.beginPath()
          ctx.lineTo2(previousPoint.center)
          ctx.lineTo2(currentPoint.center)
          // ctx.stroke()
          break
        case LineType.Bezier3:
          // ctx.beginPath()
          ctx.lineTo2(previousPoint.center)
          ctx.bezierCurveTo2(
            previousPoint.cp2,
            currentPoint.cp1,
            currentPoint.center)
          // ctx.stroke()
          break
        case LineType.Bezier2:
          let cp: P2
          if (previousPoint.cp2.use) cp = previousPoint.cp2
          if (currentPoint.cp1.use) cp = currentPoint.cp2
          // ctx.beginPath()
          ctx.lineTo2(previousPoint.center)
          ctx.quadraticCurveTo2(cp!, currentPoint.center)
          // ctx.stroke()
          break
      }
    })

    ctx.closePath()
    ctx.stroke()

    bezierCps.map((currentPoint: BezierPoint) => {
      draw.drawRound(ctx, currentPoint.center)
      if (currentPoint.cp1.use) draw.controlPoint(ctx, currentPoint.cp1, currentPoint.center)
      if (currentPoint.cp2.use) draw.controlPoint(ctx, currentPoint.cp2, currentPoint.center)
    })
    ctx.restore()

  }

  //拖动左上，改变圆角按钮
  dragRd1(point: P) {
    let {w, h} = this.conf.layout
    let {x, y} = point
    let cu = CanvasUtil2.getInstance()
    let dx = (x - cu.startX)
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
    console.log('th.enterRd1')
  }
}