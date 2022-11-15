import {BaseShape} from "./BaseShape"
import {draw3, renderRoundRect} from "../utils"
import CanvasUtil2 from "../CanvasUtil2"
import {P, ShapeConfig} from "../type"
import {drawEllipseSelectedHover} from "./Ellipse/draw"

export class Rectangle extends BaseShape {

  isIn(p: P, cu: CanvasUtil2): boolean {
    return super.isInBox(p)
  }

  render(ctx: CanvasRenderingContext2D, conf: ShapeConfig, parent?: any): ShapeConfig {
    let {
      x, y, w, h, radius,
      fillColor, borderColor, rotate, lineWidth,
      type, flipVertical, flipHorizontal, children,
    } = conf
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
    return conf
  }

  renderSelectedHover(ctx: CanvasRenderingContext2D, conf: any): void {
    drawEllipseSelectedHover(ctx, conf)
  }
}