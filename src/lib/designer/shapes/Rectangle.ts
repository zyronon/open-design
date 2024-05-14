import {BaseShape} from "./core/BaseShape"
import CanvasUtil, {CU} from "../engine/CanvasUtil"
import {BaseEvent2, LineShape, LineType, MouseOptionType, P, PointInfo, ShapeStatus} from "../types/type"
import {Colors, defaultConfig} from "../utils/constant"
import {BaseConfig, Rect} from "../config/BaseConfig"
import draw from "../utils/draw"
import helper from "../utils/helper"
import {getPenPoint} from "../config/PenConfig";
import {Pen} from "./Pen";

export class Rectangle extends Pen {
  //最小拖动圆角。真实圆角可能为0，导致渲染的控制点和角重合，所以设置一个最小圆角
  minDragRadius = 15
  rectHoverType: MouseOptionType = MouseOptionType.None
  rectEnterType: MouseOptionType = MouseOptionType.None

  constructor(props: any) {
    super(props)
    // if (props.id === 'e378e9bc-080a-46ab-b184-ce86647aca9e') {
    // if (false) {
    //   let event: BaseEvent2 = {
    //     capture: false,
    //     e: {} as any,
    //     point: {x: 0, y: 0},
    //     screenPoint: {x: 0, y: 0},
    //     canvasPoint: {x: 0, y: 0},
    //     type: '',
    //     stopPropagation() {
    //       this.capture = true
    //     },
    //     cancelStopPropagation() {
    //       this.capture = false
    //     }
    //   }
    //   this._dblclick(event)
    // }

    // let check = ['drawShape', 'drawHover']
    // check.map(m => {
    //   let s = super[m]
    //   this[m] = new Proxy(this[m], {
    //     apply(target, ctx, args) {
    //       console.log('Rectangle drawShape apply', ctx.conf.isCustom)
    //       if (ctx.conf.isCustom) {
    //         return s.apply(ctx, args)
    //       }
    //       return target.apply(ctx, args)
    //     }
    //   })
    // })
  }

  get _conf(): BaseConfig {
    return this.conf as any
  }

  set _conf(val) {
    this.conf = val
  }

  beforeEvent(event: BaseEvent2) {
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

  isInShapeOnSelect(mousePoint: P, cu: CanvasUtil): boolean {
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

  isInShape(mousePoint: P, cu: CanvasUtil): boolean {
    return helper.isInBox(mousePoint, this.conf.box)
    // let r = helper.isInPolygon(mousePoint, this.conf.lineShapes[0].points.map(v => v.point!), this.conf.center)
    // console.log('r', r)
    // return r
  }

  drawShape(ctx: CanvasRenderingContext2D, newLayout: Rect, parent?: BaseConfig) {
    // console.log('Rectangle drawShape')
    // super.drawShape(ctx, newLayout, parent)
    if (this.status === ShapeStatus.Edit) return
    let {
      radius,
      fillColor, borderColor, lineWidth, strokeAlign
    } = this.conf

    ctx.lineWidth = lineWidth ?? defaultConfig.lineWidth
    ctx.lineCap = "round"
    ctx.strokeStyle = borderColor
    ctx.fillStyle = fillColor

    let path = this.getShapePath(newLayout)
    ctx.stroke(path)
    ctx.fill(path)

    // //描边
    // let {x, y, w, h} = newLayout
    // let lw2 = ctx.lineWidth / 2
    // if (strokeAlign === StrokeAlign.INSIDE) {
    //   x += lw2, y += lw2, w -= lw2 * 2, h -= lw2 * 2, radius -= lw2
    // } else if (strokeAlign === StrokeAlign.OUTSIDE) {
    //   x -= lw2, y -= lw2, w += lw2 * 2, h += lw2 * 2, radius += lw2
    // }
    // ctx.strokeStyle = borderColor
    // path = this.getShapePath({x, y, w, h}, radius)
    // ctx.stroke(path)
  }

  drawHover(ctx: CanvasRenderingContext2D, newLayout: Rect): void {
    ctx.strokeStyle = defaultConfig.strokeStyle
    let path = this.getShapePath(newLayout)
    ctx.stroke(path)
  }

  drawSelected(ctx: CanvasRenderingContext2D, newLayout: Rect): void {
    ctx.strokeStyle = defaultConfig.strokeStyle
    let strokePath = this.getShapePath(newLayout)
    ctx.stroke(strokePath)
    draw.selected(ctx, newLayout, this.conf.isPointOrLine)
  }

  drawSelectedHover(ctx: CanvasRenderingContext2D, layout: Rect): void {
    if (this._conf.isCustom) return
    // console.log('drawSelectedHover')
    let {x, y, w, h} = layout
    let {radius,} = this.conf
    ctx.strokeStyle = defaultConfig.strokeStyle
    ctx.fillStyle = Colors.White

    let cu = CanvasUtil.getInstance()
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
    draw.drawRound(ctx, topLeft, r2,)
    draw.drawRound(ctx, topRight, r2,)
    draw.drawRound(ctx, bottomLeft, r2,)
    draw.drawRound(ctx, bottomRight, r2,)
  }

  //拖动左上，改变圆角按钮
  // todo 当水平翻转的时候不行
  dragRd1(point: P) {
    // console.log('th.enterRd1')
    let {w, h} = this.conf.layout
    let {x, y} = point
    let cu = CanvasUtil.getInstance()
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

  onMouseDowned(event: BaseEvent2, parents: BaseShape[]): boolean {
    return false;
  }

  getPenNetwork() {
    let {w, h} = this._conf.layout
    let r = this._conf.radius
    this._conf.penNetwork.nodes = []
    this._conf.penNetwork.paths = []
    const {nodes, paths,} = this._conf.penNetwork

    let rr = {cornerRadius: r, realCornerRadius: r}

    //这里的xy这样设置是因为，渲染时的起点是center
    let x = -w / 2, y = -h / 2
    nodes.push(getPenPoint({x, y, ...rr}))
    nodes.push(getPenPoint({x: x + w, y: y, ...rr}))
    nodes.push(getPenPoint({x: x + w, y: y + h, ...rr}))
    nodes.push(getPenPoint({x: x, y: y + h, ...rr}))

    paths.push([0, 1, -1, -1, LineType.Line])
    paths.push([1, 2, -1, -1, LineType.Line])
    paths.push([2, 3, -1, -1, LineType.Line])
    paths.push([3, 0, -1, -1, LineType.Line])
  }

  getShapePath(layout: Rect = this.conf.layout, r: number = this.conf.radius): Path2D {
    // if (this._conf.isCustom) {
    //   return super.getCustomShapePath()
    // }
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

}
