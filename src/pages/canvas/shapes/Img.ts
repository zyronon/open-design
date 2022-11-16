import {BaseShape} from "./BaseShape"
import {P} from "../type"
import CanvasUtil2 from "../CanvasUtil2"

export class Img extends BaseShape {
  img: any = undefined

  constructor(props: any) {
    super(props)
  }

  isIn(p: P, cu: CanvasUtil2): boolean {
    return super.isInBox(p)
  }

  get _config(): any {
    return this.config
  }

  set _config(val) {
    this.config = val
  }

  render(ctx: CanvasRenderingContext2D, p: P, parent?: any): void {
    let {
      w, h, radius,
      fillColor, borderColor, rotate, lineWidth,
      type, flipVertical, flipHorizontal, children,
      src
    } = this._config
    const {x, y} = p
    ctx.save()
    let currentImg = this.img
    if (currentImg) {
      ctx.drawImage(currentImg, x, y, w, h)
    } else {
      let img = new Image()
      img.onload = () => {
        this.img = img
        ctx.drawImage(img, x, y, w, h)
      }
      img.src = require('../../../assets/image/a.jpg')
    }
    ctx.restore()
  }

  renderSelectedHover(ctx: CanvasRenderingContext2D, conf: any): void {
  }

}