import {BaseShape} from "./BaseShape"
import {draw2, draw3, getPath, renderRoundRect} from "../utils"
import CanvasUtil2 from "../CanvasUtil2"
import {P, ShapeConfig} from "../type"
import {drawEllipseSelectedHover} from "./Ellipse/draw"

export class Frame extends BaseShape {

  isIn(p: P, cu: CanvasUtil2): boolean {
    return super.isInBox(p)
  }

  render(ctx: CanvasRenderingContext2D, p: P, parent?: any) {
    let {
      w, h, radius,
      fillColor, borderColor, rotate, lineWidth,
      type, flipVertical, flipHorizontal, children,
    } = this.config
    const {x, y} = p
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
  }

  renderSelectedHover(ctx: CanvasRenderingContext2D, conf: any): void {
    drawEllipseSelectedHover(ctx, conf)
  }
}