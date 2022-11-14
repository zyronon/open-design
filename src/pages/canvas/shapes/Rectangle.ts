import {BaseShape} from "./BaseShape"
import {draw2, draw3} from "../utils"
import CanvasUtil2 from "../CanvasUtil2"
import {P} from "../type"

export class Rectangle extends BaseShape {

  isIn(p: P, cu: CanvasUtil2): boolean {
    return super.isInBox(p)
  }

  render(ctx: CanvasRenderingContext2D, parent?: any): void {
    draw3(ctx, this.config, this.original, this.getState(), parent)
  }
}