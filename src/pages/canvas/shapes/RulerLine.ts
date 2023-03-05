import {BaseShape} from "./BaseShape"
import {BaseEvent2, P} from "../utils/type"
import CanvasUtil2 from "../CanvasUtil2"
import {BaseConfig} from "../config/BaseConfig"

export class RulerLine extends BaseShape {
  beforeShapeIsIn(): boolean {
    return false
  }

  childDbClick(event: BaseEvent2, parents: BaseShape[]): boolean {
    return false
  }

  childMouseDown(event: BaseEvent2, parents: BaseShape[]): boolean {
    this.enter = true
    return true
  }

  childMouseMove(event: BaseEvent2, parents: BaseShape[]): boolean {
    if (this.enter) {
      return true
    }
    return true
  }

  childMouseUp(event: BaseEvent2, parents: BaseShape[]): boolean {
    return false
  }

  isHoverIn(mousePoint: P, cu: CanvasUtil2): boolean {
    const {x, y} = mousePoint
    let r = 0 < x && x < cu.canvasRect.width
      && 0 < y && y < 20
    if (r) {
      document.body.style.cursor = 'row-resize'
    } else {
      document.body.style.cursor = 'default'
    }
    return r
  }

  isInOnSelect(p: P, cu: CanvasUtil2): boolean {
    return false
  }

  isHorizontal(): boolean {
    return this.conf.data?.direction === 'horizontal'
  }

  drawShape(ctx: CanvasRenderingContext2D, xy: P, parent?: BaseConfig): any {
    let cu = CanvasUtil2.getInstance()
    if (this.isHorizontal()) {
      ctx.rect(xy.x, xy.y, cu.canvasRect.width, 1)
    } else {
      ctx.rect(xy.x, xy.y, 1, cu.canvasRect.width)
    }
    ctx.fill()
  }

  drawEdit(ctx: CanvasRenderingContext2D, xy: P, parent?: BaseConfig): any {
  }

  drawHover(ctx: CanvasRenderingContext2D, xy: P, parent?: BaseConfig): any {
  }

  drawSelected(ctx: CanvasRenderingContext2D, xy: P, parent?: BaseConfig): any {
  }

  drawSelectedHover(ctx: CanvasRenderingContext2D, conf: any): void {
  }

}