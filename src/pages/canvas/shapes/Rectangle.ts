import {BaseShape} from "./BaseShape"
import {draw2} from "../utils"
import CanvasUtil2 from "../CanvasUtil2"
import {P, ShapeConfig} from "../type"
import {getShapeFromConfig} from "./common"

export class Rectangle extends BaseShape {
  constructor(conf: ShapeConfig) {
    super(conf)

  }

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