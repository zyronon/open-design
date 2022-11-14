import {BaseShape} from "./BaseShape"
import {draw3} from "../utils"
import {P} from "../type"
import CanvasUtil2 from "../CanvasUtil2"

export class Ellipse extends BaseShape {
  isIn(p: P, cu: CanvasUtil2): boolean {
    return super.isInBox(p)
  }

  render(ctx: CanvasRenderingContext2D, parent?: any): void {
    draw3(ctx, this.config, this.original, this.getState(), parent)
  }

  static render2() {

  }

}