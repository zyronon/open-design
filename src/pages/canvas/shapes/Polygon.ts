import {BaseShape} from "./BaseShape"
import {EllipseConfig, P} from "../type"
import CanvasUtil2 from "../CanvasUtil2"

export class Polygon extends BaseShape {
  isIn(p: P, cu: CanvasUtil2): boolean {
    return super.isInBox(p)
  }

  get _config() {
    return this.config
  }

  set _config(val) {
    this.config = val
  }

  render(ctx: CanvasRenderingContext2D, p: P, parent?: any) {
    let {
      w, h, radius,
      fillColor, borderColor, rotate, lineWidth,
      type, flipVertical, flipHorizontal, children,
    } = this._config
    const {x, y} = p
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

  renderSelectedHover(ctx: CanvasRenderingContext2D, conf: any): void {
  }

}