import {BaseShape} from "./BaseShape"
import CanvasUtil2 from "../CanvasUtil2"
import {P, TextAlign, TextConfig} from "../type"
import {RectType} from "../../canvas-old/type"
import {renderRound} from "../../canvas-old/utils"
import {cloneDeep} from "lodash"

export class Arrow extends BaseShape {
  isIn(p: P, cu: CanvasUtil2): boolean {
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
    if (points.length) {
      ctx.strokeStyle = borderColor
      ctx.lineCap = "round"
      let start = points[0]
      let d = 20
      ctx.moveTo(start.x, start.y)

      let degree = 0
      if (points.length === 2) {
        let end = points[1]
      }

      ctx.beginPath()
      ctx.lineTo(start.x + d, start.y + d)
      ctx.lineTo(start.x - d, start.y + d)
      ctx.lineTo(start.x, start.y)
      ctx.closePath()
      ctx.stroke()
      points.map((item: any, index: number, arr: any[]) => {
        ctx.beginPath()
        ctx.moveTo(item.x, item.y)
        if (index !== arr.length - 1) {
          ctx.lineTo(arr[index + 1].x, arr[index + 1].y)
          ctx.stroke()
        }
      })
    }
  }

  renderSelectedHover(ctx: CanvasRenderingContext2D, conf: any): void {
  }

}