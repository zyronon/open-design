import {BaseShape} from "./BaseShape"
import {draw2, draw3, getPath} from "../utils"
import CanvasUtil2 from "../CanvasUtil2"
import {P, ShapeConfig} from "../type"

export class Frame extends BaseShape {

  // constructor(props: ShapeConfig) {
  //   super(props)
  // }

  isIn(p: P, cu: CanvasUtil2): boolean {
    return super.isInBox(p)
  }

  render(ctx: CanvasRenderingContext2D, parent?: any): void {
    draw3(ctx, this.config, this.original, this.getState(), parent)
    if (this.children) {
      this.children.map((item: any) => item.render(ctx, this.config))
    }
  }

}