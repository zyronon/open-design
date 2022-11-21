import {BaseShape} from "./BaseShape"
import {BaseEvent2, P, ShapeConfig} from "../type"
import CanvasUtil2 from "../CanvasUtil2"
import {calcPosition} from "../utils"

export class Img extends BaseShape {
  img: any = undefined

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

  render(ctx: CanvasRenderingContext2D, p: P, parent?: ShapeConfig) {
    let {
      w, h,
      fillColor, borderColor, rotate, lineWidth,
      src,
    } = this._config
    const {x, y} = p
    // ctx.save()
    if (this.img) {
      ctx.drawImage(this.img, x, y, w, h)
    } else {
      ctx.fillStyle = 'white'
      ctx.fillRect(x, y, w, h)
      let img = new Image()
      if (src.includes('http')) {
        img.src = src
      } else {
        img.src = require('../../../assets/image/' + src)
      }
      img.onload = () => {
        this.img = img
        CanvasUtil2.getInstance().nextRender()
      }
    }
  }
  renderHover(ctx: CanvasRenderingContext2D,xy: P, parent?: ShapeConfig): void {}
  renderSelected(ctx: CanvasRenderingContext2D,xy: P, parent?: ShapeConfig): void {}
 
  renderSelectedHover(ctx: CanvasRenderingContext2D, conf: any): void {
  }

  renderEdit(ctx: CanvasRenderingContext2D, p: P, parent?: ShapeConfig): void {
  }
}