import {BaseShape} from "./BaseShape"
import {P} from "../type"
import CanvasUtil2 from "../CanvasUtil2"
import {calcPosition} from "../utils"

export class Img extends BaseShape {
  img: any = undefined

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

  render(ctx: CanvasRenderingContext2D, p: P, parent?: any) {
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

  renderSelectedHover(ctx: CanvasRenderingContext2D, conf: any): void {
  }

}