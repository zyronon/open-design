import {BaseShape} from "./BaseShape";
import {draw2} from "../utils";
import CanvasUtil2 from "../CanvasUtil2";
import {P} from "../type";

export class Rectangle extends BaseShape {
  isIn(p: P, cu: CanvasUtil2): boolean {
    return super.isInBox(p)
  }


  render(ctx: CanvasRenderingContext2D, parent?: any): void {
    draw2(ctx, this.config, this.original, {
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