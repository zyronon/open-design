import {BaseShape} from "./BaseShape"
import {clear, renderRound, renderRoundRect} from "../utils"
import CanvasUtil2 from "../CanvasUtil2"
import {BaseEvent2, P, ShapeConfig, ShapeType} from "../type"
import {drawSelectedHover} from "./Ellipse/draw"
import {jiaodu2hudu} from "../../../utils"

export class Rectangle extends BaseShape {

  childDbClick(event: BaseEvent2, p: BaseShape[]): boolean {
    return false
  }
  childMouseDown() {
    return false
  }

  childMouseMove() {
    return false
  }

  childMouseUp() {
    return false
  }

  beforeShapeIsIn() {
    return false
  }

  isInOnSelect(p: P, cu: CanvasUtil2): boolean {
    return false
  }

  isHoverIn(p: P, cu: CanvasUtil2): boolean {
    return super.isInBox(p)
  }

  render(ctx: CanvasRenderingContext2D, p: P, parent?: ShapeConfig) {
    let {
      w, h, radius,
      fillColor, borderColor, rotate, lineWidth,
      type, flipVertical, flipHorizontal, children,
    } = this.config
    const {x, y} = p
    ctx.save()
    if (radius) {
      renderRoundRect({x, y, w, h}, radius, ctx)
    } else {
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + w, y)
      ctx.lineTo(x + w, y + h)
      ctx.lineTo(x, y + h)
      ctx.lineTo(x, y)
      ctx.closePath()
      ctx.fillStyle = fillColor
      ctx.fill()
      ctx.strokeStyle = borderColor
      ctx.stroke()
    }
    ctx.restore()
  }
  renderHover(ctx: CanvasRenderingContext2D,xy: P, parent?: ShapeConfig): void {}
  renderSelected(ctx: CanvasRenderingContext2D,xy: P, parent?: ShapeConfig): void {}
  renderSelectedHover(ctx: CanvasRenderingContext2D, conf: any): void {
    let {
      x, y, w, h, radius,
      fillColor, borderColor, rotate,
      type, flipVertical, flipHorizontal, children,
    } = conf
    ctx.strokeStyle = 'rgb(139,80,255)'

    let d = 4
    let radius2 = 200
    let min = Math.min(w, h)
    // debugger
    let maxRadius = min / 2
    // let hypotenuse = Math.sqrt(Math.pow(maxRadius, 2) + Math.pow(maxRadius, 2))
    let hypotenuse = Math.hypot(maxRadius, maxRadius)

    let radiusHyp = hypotenuse / maxRadius * radius2
    let cos = Math.cos(jiaodu2hudu(45))
    let hey = cos * radiusHyp
    // console.log(hey)


    d = 20
    d = radius
    let r2 = 5
    let t = conf
    let endTop = {
      x: t.x + Math.min(t.w, t.h) / 2,
      y: t.y + Math.min(t.w, t.h) / 2,
    }
    let endBottom = {
      x: t.x + Math.min(t.w, t.h) / 2,
      y: t.y + t.h - Math.min(t.w, t.h) / 2,
    }
    let topLeft = {
      x: t.x + d,
      y: t.y + d,
    }
    let topRight = {
      x: t.x + t.w - d,
      y: t.y + d,
    }
    let bottomLeft = {
      x: t.x + d,
      y: t.y + t.h - d,
    }
    let bottomRight = {
      x: t.x + t.w - d,
      y: t.y + t.h - d,
    }
    ctx.save()
    // let nv = currentMat
    // ctx.transform(nv[0], nv[4], nv[1], nv[5], nv[12], nv[13]);
    // renderRound(endTop, r, ctx, ShapeType.SELECT)
    // renderRound(endBottom, r, ctx, ShapeType.SELECT)

    renderRound(topLeft, r2, ctx, ShapeType.SELECT)
    renderRound(topRight, r2, ctx, ShapeType.SELECT)
    renderRound(bottomLeft, r2, ctx, ShapeType.SELECT)
    renderRound(bottomRight, r2, ctx, ShapeType.SELECT)
    ctx.restore()
  }
  renderEdit(ctx: CanvasRenderingContext2D, conf: any): void {
    let {
      x, y, w, h, radius,
      fillColor, borderColor, rotate,
      type, flipVertical, flipHorizontal, children,
    } = conf
    ctx.strokeStyle = 'rgb(139,80,255)'

    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + w, y)
    ctx.lineTo(x + w, y + h)
    ctx.lineTo(x, y + h)
    ctx.lineTo(x, y)
    ctx.closePath()
    ctx.stroke()
    let d = 4
    clear({
      x: x - d,
      y: y - d,
      w: 2 * d,
      h: 2 * d
    }, ctx)
    clear({
      x: x + w - d,
      y: y - d,
      w: 2 * d,
      h: 2 * d
    }, ctx)
    clear({
      x: x + w - d,
      y: y + h - d,
      w: 2 * d,
      h: 2 * d
    }, ctx)
    clear({
      x: x - d,
      y: y + h - d,
      w: 2 * d,
      h: 2 * d
    }, ctx)

    let r = 3
    let lineWidth = 1.5
    renderRoundRect({
      x: x - d,
      y: y - d,
      w: 2 * d,
      h: 2 * d,
      lineWidth
    }, r, ctx)
    renderRoundRect({
      x: x + w - d,
      y: y - d,
      w: 2 * d,
      h: 2 * d,
      lineWidth
    }, r, ctx)
    renderRoundRect({
      x: x + w - d,
      y: y + h - d,
      w: 2 * d,
      h: 2 * d,
      lineWidth
    }, r, ctx)
    renderRoundRect({
      x: x - d,
      y: y + h - d,
      w: 2 * d,
      h: 2 * d,
      lineWidth
    }, r, ctx)


    d = 40
    let r2 = 5
    let t = conf
    let topLeft = {
      x: t.x + d,
      y: t.y + d,
    }
    renderRound(topLeft, r2, ctx, ShapeType.SELECT)
  }
}