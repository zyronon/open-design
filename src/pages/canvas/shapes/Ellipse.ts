import {BaseShape} from "./BaseShape";
import {draw3} from "../utils";

export class Ellipse extends BaseShape{
  isIn(): void {
  }

  mousedown(): void {
  }

  mousemove(): void {
  }

  mouseup(): void {
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