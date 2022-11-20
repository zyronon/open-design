import {BaseShape} from "./BaseShape"
import CanvasUtil2 from "../CanvasUtil2"
import {P, TextAlign, TextConfig} from "../type"

export class Pencil extends BaseShape {

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

  get _config(): any {
    return this.config
  }

  set _config(val) {
    this.config = val
  }

  render(ctx: CanvasRenderingContext2D, p: P, parent?: any): any {
    let {
      w, h, radius,
      points,
      borderColor
    } = this._config
    const {x, y} = p
    if (points?.length) {
      ctx.strokeStyle = borderColor
      // ctx.lineCap = "round";
      ctx.moveTo(points[0]?.x, points[0]?.y)
      points.map((item: any) => {
        ctx.lineTo(item.x, item.y)
      })
      ctx.stroke()
    }
  }

  renderSelectedHover(ctx: CanvasRenderingContext2D, conf: any): void {
  }

}