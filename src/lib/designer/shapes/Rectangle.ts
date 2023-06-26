import {BaseShape} from "./core/BaseShape"
import CanvasUtil2 from "../engine/CanvasUtil2"
import {
  BaseEvent2,
  BezierPointType,
  EditType,
  getP2,
  LinePath,
  LineShape,
  MouseOptionType,
  P,
  PointInfo,
  PointType,
  ShapeStatus,
  StrokeAlign
} from "../types/type"
import {Colors, defaultConfig} from "../utils/constant"
import {BaseConfig, Rect} from "../config/BaseConfig"
import draw from "../utils/draw"
import {v4 as uuid} from 'uuid'
import helper from "../utils/helper"
import {ParentShape} from "./core/ParentShape";

export class Rectangle extends ParentShape {
  //最小拖动圆角。真实圆角可能为0，导致渲染的控制点和角重合，所以设置一个最小圆角
  minDragRadius = 15
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
      this._dblclick(event)
    }
  }

  get _config(): BaseConfig {
    return this.conf as any
  }

  set _config(val) {
    this.conf = val
  }

  beforeIsInShape() {
    return false
  }

  beforeEvent(event: BaseEvent2) {
    if (this.editEnter.pointIndex > -1) {
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
    return helper.isInBox(mousePoint, this.conf.box)
    // @ts-ignore
    let r = helper.isInPolygon(mousePoint, this.conf.lineShapes[0].points.map(v => v.point!), this.conf.center)
    console.log('r', r)
    return r
  }

  drawShape(ctx: CanvasRenderingContext2D, newLayout: Rect, parent?: BaseConfig) {
    if (this.status === ShapeStatus.Edit) return
    let {
      radius,
      fillColor, borderColor, lineWidth, strokeAlign
    } = this.conf
    let {x, y, w, h} = newLayout

    ctx.lineWidth = lineWidth ?? defaultConfig.lineWidth
    ctx.fillStyle = fillColor

    let {strokePathList, fillPathList} = this.getCustomShapePath2()
    let pathList = this.getShapePath(newLayout, this.conf.radius)
    // strokePathList.map(({close, path}) => {
    //   ctx.stroke(path)
    // })

    fillPathList.map(({close, path}) => {
      if (close) {
        ctx.fill(path)
      } else {
        ctx.stroke(path)
      }
    })

    //描边
    let lw2 = ctx.lineWidth / 2
    if (strokeAlign === StrokeAlign.INSIDE) {
      x += lw2, y += lw2, w -= lw2 * 2, h -= lw2 * 2, radius -= lw2
    } else if (strokeAlign === StrokeAlign.OUTSIDE) {
      x -= lw2, y -= lw2, w += lw2 * 2, h += lw2 * 2, radius += lw2
    }
    ctx.strokeStyle = borderColor
    strokePathList = this.getShapePath({x, y, w, h}, radius)
    strokePathList.map(line => {
      ctx.stroke(line.path)
    })
  }

  drawShape2(ctx: CanvasRenderingContext2D, newLayout: Rect, parent?: BaseConfig) {
    if (this.status === ShapeStatus.Edit) return
    let {
      radius,
      fillColor, borderColor, lineWidth, strokeAlign
    } = this.conf
    let {x, y, w, h} = newLayout

    ctx.lineWidth = lineWidth ?? defaultConfig.lineWidth

    //填充图形
    ctx.fillStyle = fillColor
    let pathList = this.getShapePath(newLayout, this.conf.radius)
    pathList.map(({close, path}) => {
      if (close) {
        ctx.fill(path)
      } else {
        ctx.stroke(path)
      }
    })

    //描边
    let lw2 = ctx.lineWidth / 2
    if (strokeAlign === StrokeAlign.INSIDE) {
      x += lw2, y += lw2, w -= lw2 * 2, h -= lw2 * 2, radius -= lw2
    } else if (strokeAlign === StrokeAlign.OUTSIDE) {
      x -= lw2, y -= lw2, w += lw2 * 2, h += lw2 * 2, radius += lw2
    }
    ctx.strokeStyle = borderColor
    pathList = this.getShapePath({x, y, w, h}, radius)
    pathList.map(line => {
      ctx.stroke(line.path)
    })
  }

  drawHover(ctx: CanvasRenderingContext2D, layout: Rect): void {
    ctx.strokeStyle = defaultConfig.strokeStyle
    //容器hover时只需要描边矩形就行了
    let {strokePathList, fillPathList} = this.getCustomShapePath2()
    strokePathList.map(({close, path}) => {
      ctx.stroke(path)
    })
  }

  drawSelected(ctx: CanvasRenderingContext2D, layout: Rect): void {
    ctx.strokeStyle = defaultConfig.strokeStyle
    //容器hover时只需要描边矩形就行了
    let {strokePathList, fillPathList} = this.getCustomShapePath2()
    strokePathList.map(({close, path}) => {
      ctx.stroke(path)
    })
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
      fillColor, lineShapes
    } = this.conf

    ctx.save()
    ctx.strokeStyle = Colors.Line2
    ctx.fillStyle = fillColor

    let {strokePathList, fillPathList} = this.getCustomShapePath2()
    fillPathList.map(({close, path}) => {
      if (close) {
        ctx.fill(path)
      } else {
        ctx.stroke(path)
      }
    })
    strokePathList.map(({close, path}) => {
      ctx.stroke(path)
    })

    if ((this.editHover.type === EditType.Line
        || this.editHover.type === EditType.CenterPoint)
      && this.editHover.pointIndex !== -1
    ) {
      draw.drawRound(ctx, this.hoverLineCenterPoint)
    }
    let {lineIndex, pointIndex, type} = this.editStartPointInfo
    //先绘制控制线，好被后续的圆点遮盖
    if (pointIndex !== -1 && type !== EditType.Line) {
      let line = lineShapes[lineIndex]
      let point
      if (pointIndex === 0) {
        if (line.close) {
          point = this.getPoint(line.points[line.points.length - 1])
          if (point.cp1.use) draw.controlPoint(ctx, point.cp1, point.center)
          if (point.cp2.use) draw.controlPoint(ctx, point.cp2, point.center)
        }
      } else {
        point = this.getPoint(line.points[pointIndex - 1])
        if (point.cp1.use) draw.controlPoint(ctx, point.cp1, point.center)
        if (point.cp2.use) draw.controlPoint(ctx, point.cp2, point.center)
      }
      if (pointIndex === line.points.length - 1) {
        if (line.close) {
          point = this.getPoint(line.points[0])
          if (point.cp1.use) draw.controlPoint(ctx, point.cp1, point.center)
          if (point.cp2.use) draw.controlPoint(ctx, point.cp2, point.center)
        }
      } else {
        point = this.getPoint(line.points[pointIndex + 1])
        if (point.cp1.use) draw.controlPoint(ctx, point.cp1, point.center)
        if (point.cp2.use) draw.controlPoint(ctx, point.cp2, point.center)
      }
    }
    lineShapes.map(line => {
      line.points.map((pointInfo) => {
        let point = this.getPoint(pointInfo)
        // if (point.cp1.use) draw.controlPoint(ctx, point.cp1, point.center)
        // if (point.cp2.use) draw.controlPoint(ctx, point.cp2, point.center)
        draw.drawRound(ctx, point.center)
      })
    })
    if (pointIndex !== -1 && type !== EditType.Line) {
      let line = lineShapes[lineIndex]
      let point = this.getPoint(line.points[pointIndex])
      if (point.cp1.use) draw.controlPoint(ctx, point.cp1, point.center)
      if (point.cp2.use) draw.controlPoint(ctx, point.cp2, point.center)
      draw.currentPoint(ctx, point.center)
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

  onDbClick(event: BaseEvent2, parents: BaseShape[]): boolean {
    return false
  }

  getCustomPoint(): LineShape[] {
    let {w, h} = this._config.layout
    //这里的xy这样设置是因为，渲染时的起点是center
    let x = -w / 2, y = -h / 2
    let points: PointInfo[] = []
    points.push({
      type: PointType.Single,
      point: {
        id: uuid(),
        cp1: getP2(),
        center: {...getP2(true), x: x, y: y},
        cp2: getP2(),
        type: BezierPointType.RightAngle
      }
    })
    points.push({
      type: PointType.Single,
      point: {
        id: uuid(),
        cp1: getP2(),
        center: {...getP2(true), x: x + w, y: y},
        cp2: getP2(),
        type: BezierPointType.RightAngle
      }
    })
    points.push({
      type: PointType.Single,
      point: {
        id: uuid(),
        cp1: getP2(),
        center: {...getP2(true), x: x + w, y: y + h},
        cp2: getP2(),
        type: BezierPointType.RightAngle
      }
    })
    points.push({
      type: PointType.Single,
      point: {
        id: uuid(),
        cp1: getP2(),
        center: {...getP2(true), x: x, y: y + h},
        cp2: getP2(),
        type: BezierPointType.RightAngle
      }
    })
    return [{close: true, points: points}]
  }

  onMouseDown(event: BaseEvent2, parents: BaseShape[]) {
    // console.log('childMouseDown', this.editHover)
    this.rectEnterType = this.rectHoverType
    return false
  }

  onMouseMove(event: BaseEvent2, parents: BaseShape[]) {
    // console.log('childMouseMove', this.editEnter)
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
    return false
  }

  getShapePath(layout: Rect, r: number): LinePath[] {
    if (this._config.isCustom) {
      return super.getCustomShapePath()
    }
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
    return [{close: true, path}]
  }

  onMouseDowned(event: BaseEvent2, parents: BaseShape[]): boolean {
    return false;
  }

}
