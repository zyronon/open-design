import {BaseShape} from "./BaseShape"
import CanvasUtil2 from "../CanvasUtil2"
import {BaseEvent2, P, ShapeConfig, TextAlign, TextConfig} from "../type"
import {RectType} from "../../canvas-old/type"
import {renderRound} from "../../canvas-old/utils"
import {cloneDeep} from "lodash"

export class Pen extends BaseShape {

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

  get _config(): any {
    return this.config
  }

  set _config(val) {
    this.config = val
  }

  render(ctx: CanvasRenderingContext2D, p: P, parent?: ShapeConfig): any {
    let {
      w, h, radius,
      points,
      borderColor
    } = this._config
    const {x, y} = p
    if (points?.length) {
      ctx.strokeStyle = borderColor
      ctx.lineCap = "round"
      ctx.moveTo(points[0]?.x, points[0]?.y)
      points.map((item: any, index: number, arr: any[]) => {
        // if (isEdit && isMe) {
        //   renderRound({
        //       x: item.x,
        //       y: item.y,
        //       w: rect.w,
        //       h: rect.h,
        //     }, 4, ctx,
        //     index !== arr.length - 1 ? undefined : RectType.RECT)
        // }
        ctx.beginPath()
        ctx.moveTo(item.x, item.y)
        if (index !== arr.length - 1) {
          ctx.lineTo(arr[index + 1].x, arr[index + 1].y)
          ctx.stroke()
        }
      })
    }
  }
  renderHover(ctx: CanvasRenderingContext2D,xy: P, parent?: ShapeConfig): void {}
  renderSelected(ctx: CanvasRenderingContext2D,xy: P, parent?: ShapeConfig): void {}
 
  renderSelectedHover(ctx: CanvasRenderingContext2D, conf: any): void {
  }

  renderEdit(ctx: CanvasRenderingContext2D, xy: P, parent?: ShapeConfig): void {
  }
}