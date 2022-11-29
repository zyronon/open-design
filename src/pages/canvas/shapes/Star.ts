import {BaseShape} from "./BaseShape"
import {BaseEvent2, P} from "../type"
import CanvasUtil2 from "../CanvasUtil2"
import {BaseConfig} from "../config/BaseConfig"

export class Star extends BaseShape {

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

  get _config() {
    return this.config
  }

  set _config(val) {
    this.config = val
  }

  renderHover(ctx: CanvasRenderingContext2D,xy: P, parent?: BaseConfig): void {}
  renderSelected(ctx: CanvasRenderingContext2D,xy: P, parent?: BaseConfig): void {}
  renderEdit(ctx: CanvasRenderingContext2D,xy: P, parent?: BaseConfig): void {}

  render(ctx: CanvasRenderingContext2D, p: P, parent?: BaseConfig): void {
    let {
      w, h, radius,
      fillColor, borderColor, rotate, lineWidth,
      type, flipVertical, flipHorizontal, children,
    } = this._config
    const {x, y} = p
    ctx.save()
    let outA = w / 2
    let outB = h / 2
    let innerA = outA / 2.6
    let innerB = outB / 2.6
    let x1, x2, y1, y2
    ctx.translate(x + w / 2, y + h / 2)

    ctx.beginPath()
    for (let i = 0; i < 5; i++) {
      x1 = outA * Math.cos((54 + i * 72) / 180 * Math.PI)
      y1 = outB * Math.sin((54 + i * 72) / 180 * Math.PI)
      x2 = innerA * Math.cos((18 + i * 72) / 180 * Math.PI)
      y2 = innerB * Math.sin((18 + i * 72) / 180 * Math.PI)
      //内圆
      ctx.lineTo(x2, y2)
      //外圆
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