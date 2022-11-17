import {BaseShape} from "./BaseShape"
import {P} from "../type"
import CanvasUtil2 from "../CanvasUtil2"
import {calcPosition} from "../utils"

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

  render(ctx: CanvasRenderingContext2D, p: P, parent?: any): Promise<any> {
    /*
    * 这里需要返回一个Promise，因为第一次渲染图像的时候，是异步的。当onload执行时，父类已经
    * 执行ctx.restore()了。所以画出来的位置不对
    * */
    return new Promise(resolve => {
      let {
        w, h,
        fillColor, borderColor, rotate, lineWidth,
      } = this._config
      const {x, y} = p
      // ctx.save()
      if (this.img) {
        ctx.drawImage(this.img, x, y, w, h)
        resolve(true)
      } else {
        let img = new Image()
        img.onload = () => {
          this.img = img
          ctx.drawImage(img, x, y, w, h)
          resolve(true)
        }
        img.src = require('../../../assets/image/a.jpg')
      }
      ctx.strokeRect(x, y, w, h)
      // ctx.restore()
    })
  }

  renderSelectedHover(ctx: CanvasRenderingContext2D, conf: any): void {
  }

}