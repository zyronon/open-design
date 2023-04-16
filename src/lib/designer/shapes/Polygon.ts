import {BaseConfig, Rect} from "../config/BaseConfig"
import {ParentShape} from "./core/ParentShape";

export class Polygon extends ParentShape {

  drawShape(ctx: CanvasRenderingContext2D, newLayout: Rect, parent?: BaseConfig | undefined): void {
    let {
      radius, fillColor, borderColor, rotation, lineWidth,
      type, flipVertical, flipHorizontal, children,
    } = this.conf
    let {x, y, w, h} = newLayout
    ctx.save()
    let outA = w / 2
    let outB = h / 2
    let x1, x2, y1, y2
    ctx.translate(x + w / 2, y + h / 2)

    ctx.beginPath()
    for (let i = 0; i < 3; i++) {
      x1 = outA * Math.cos((30 + i * 120) / 180 * Math.PI)
      y1 = outB * Math.sin((30 + i * 120) / 180 * Math.PI)
      ctx.lineTo(x1, y1)
    }
    ctx.closePath()
    ctx.fillStyle = fillColor
    ctx.fill()
    ctx.strokeStyle = borderColor
    ctx.stroke()
    ctx.restore()
  }

}