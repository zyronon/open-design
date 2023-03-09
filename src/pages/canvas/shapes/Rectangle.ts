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
import helper from "../utils/helper"

export class Rectangle extends BaseShape {

  //最小拖动圆角。真实圆角可能为0，导致渲染的控制点和角重合，所以设置一个最小圆角
  minDragRadius = 15
  hoverPointIndex: number = -1
  enterPointIndex: number = -1
  rectHoverType: MouseOptionType = MouseOptionType.None
  rectEnterType: MouseOptionType = MouseOptionType.None
  //编辑模式下，hover在线段上时，临时绘制的控制点
  tempDrawCp: any = []
  hoverLineIndex: number = -1
  hoverLinePoint: P = {x: 0, y: 0}


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

  get _config(): any {
    return this.conf as any
  }

  set _config(val) {
    this.conf = val
  }

  onDbClick(event: BaseEvent2, parents: BaseShape[]): boolean {
    let cu = CanvasUtil2.getInstance()
    if (this.status === ShapeStatus.Edit) {
      this.status = ShapeStatus.Select
      cu.editShape = null
    } else {
      if (!this._config.points.length) {
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
        this._config.points = bezierCps
      }
      this.status = ShapeStatus.Edit
      cu.editShape = this
    }
    return false
  }

  onMouseDown(event: BaseEvent2, parents: BaseShape[]) {
    // console.log('childMouseDown', this.hoverPointIndex)
    if (this.status === ShapeStatus.Edit) {
      if (this.hoverPointIndex > -1) {
        this.enterPointIndex = this.hoverPointIndex
        this._config.isCustom = true
        return true
      }
    }
    this.rectEnterType = this.rectHoverType
    return false
  }

  onMouseMove(event: BaseEvent2, parents: BaseShape[]) {
    // console.log('childMouseMove', this.hoverPointIndex)
    if (this.status === ShapeStatus.Edit) {
      if (this.enterPointIndex === -1) return false
      let cu = CanvasUtil2.getInstance()
      let {absolute: {x, y}, layout: {w, h}} = this._config
      this._config.points[this.hoverPointIndex].center = {
        x: event.point.x - (x + w / 2),
        y: event.point.y - (y + h / 2)
      }
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

  onMouseUp(event: BaseEvent2, parents: BaseShape[]) {
    // console.log('childMouseUp', this.hoverPointIndex)
    this.rectEnterType = this.rectHoverType = MouseOptionType.None
    this.enterPointIndex = this.hoverPointIndex = -1
    return false
  }

  beforeIsInShape() {
    return false
  }

  beforeEvent(event: BaseEvent2) {
    if (this.enterPointIndex > -1) {
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
      let {absolute: {x, y}, layout: {w, h}, points} = this._config
      this.hoverPointIndex = -1
      let fixMousePoint = {
        x: mousePoint.x - (x + w / 2),
        y: mousePoint.y - (y + h / 2)
      }

      let tempHoverLineIndex = -1
      for (let index = 0; index < points.length; index++) {
        let currentPoint = points[index]
        if (helper.isInPoint(fixMousePoint, currentPoint.center, 4)) {
          document.body.style.cursor = "pointer"
          this.hoverPointIndex = index
          return true
        }
        let previousPoint: BezierPoint
        if (index === 0) {
          previousPoint = points[points.length - 1]
        } else {
          previousPoint = points[index - 1]
        }
        let line: any = [previousPoint.center, currentPoint.center]
        if (helper.isInLine2(fixMousePoint, line)) {
          document.body.style.cursor = "pointer"
          tempHoverLineIndex = index
          this.hoverLinePoint = helper.getCenterPoint(points[0].center, points[1].center)
          break
        }
      }

      if (this.hoverLineIndex !== tempHoverLineIndex) {
        this.hoverLineIndex = tempHoverLineIndex
        CanvasUtil2.getInstance().render()
        return true
      }
      document.body.style.cursor = "default"
    }
    return helper.isInBox(mousePoint, this.conf.box)
  }

  getShapePath(layout: Rect, r: number): Path2D {
    let {x, y, w, h} = layout
    let path = new Path2D()
    if (this._config.isCustom) {
      return this.getCustomShapePath()
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

  getCustomShapePath(): Path2D {
    let path = new Path2D()
    this._config.points.map((currentPoint: BezierPoint, index: number, array: any) => {
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
          path.lineTo2(previousPoint.center)
          path.lineTo2(currentPoint.center)
          // ctx.stroke()
          break
        case LineType.Bezier3:
          // ctx.beginPath()
          path.lineTo2(previousPoint.center)
          path.bezierCurveTo2(
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
          path.lineTo2(previousPoint.center)
          path.quadraticCurveTo2(cp!, currentPoint.center)
          // ctx.stroke()
          break
      }
    })

    path.closePath()
    return path
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
    this.log('drawEdit')
    let {
      fillColor
    } = this.conf

    ctx.save()

    ctx.strokeStyle = Colors.Line2
    ctx.fillStyle = fillColor

    let path = this.getCustomShapePath()
    ctx.fill(path)
    ctx.stroke(path)

    let bezierCps: BezierPoint[] = this._config.points
    bezierCps.map((currentPoint: BezierPoint) => {
      draw.drawRound(ctx, currentPoint.center)
      if (currentPoint.cp1.use) draw.controlPoint(ctx, currentPoint.cp1, currentPoint.center)
      if (currentPoint.cp2.use) draw.controlPoint(ctx, currentPoint.cp2, currentPoint.center)
    })
    if (this.hoverLineIndex > -1) {
      draw.drawRound(ctx, this.hoverLinePoint)
    }

    ctx.restore()
  }

  //拖动左上，改变圆角按钮
  // todo 当水平翻转的时候不行
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