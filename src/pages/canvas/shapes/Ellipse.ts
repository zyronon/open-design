import {BaseShape} from "./BaseShape";
import {draw3} from "../utils";
import {P} from "../type";
import CanvasUtil2 from "../CanvasUtil2";

export class Ellipse extends BaseShape {
  isIn(p: P, cu: CanvasUtil2): boolean {
    return super.isInBox(p)
  }

  render(ctx: CanvasRenderingContext2D, parent?: any): void {
    draw3(ctx, this.config, this.original, {
      isHover: this.isHover,
      isSelect: this.isSelect,
      isEdit: this.isEdit,
      enterLT: this.enterLT,
      enterL: this.enterL
    }, parent)
    if (this.children) {
      this.children.map((item: any) => item.render(ctx, this.config))
    }
  }

}