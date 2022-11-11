import {BaseShape} from "./BaseShape";
import {draw2} from "../utils";
import CanvasUtil2 from "../CanvasUtil2";

export class Rectangle extends BaseShape {
  isIn(x: number, y: number, cu: CanvasUtil2): boolean {
    let rect = this.config
    if (rect.leftX < x && x < rect.rightX
      && rect.topY < y && y < rect.bottomY
    ) {
      document.body.style.cursor = "default"
      this.hoverL = false
      this.hoverLT = false
      this.hoverLTR = false

      this.hoverRd1 = false
      return true
    }
    return false
  }

  mousedown(): void {
  }

  mousemove(): void {
  }

  mouseup(): void {
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