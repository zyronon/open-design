import {BaseConfig, Rect} from "../config/BaseConfig"
import {ParentShape} from "./core/ParentShape";
import CanvasUtil2 from "../engine/CanvasUtil2";

export class AssetImage extends ParentShape {
  img: any = undefined

  drawShape(ctx: CanvasRenderingContext2D, newLayout: Rect, parent?: BaseConfig | undefined): void {
    let {
      fillColor, borderColor, rotate, lineWidth,
      src = '',
    } = this.conf as any
    let {x, y, w, h} = newLayout
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
        img.src = require('@/assets/image/' + src)
      }
      img.onload = () => {
        this.img = img
        CanvasUtil2.getInstance().nextRender()
      }
    }
  }

}