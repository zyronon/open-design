import {TextAlign, TextConfig} from "../config/TextConfig"
import {BaseConfig, Rect} from "../config/BaseConfig"
import {ParentShape} from "./core/ParentShape";
import draw from "../utils/draw"
import {Colors} from "../utils/constant"

export class Text extends ParentShape {

  get _config(): TextConfig {
    return this.conf as TextConfig
  }

  set _config(val) {
    this.conf = val
  }

  drawShape(ctx: CanvasRenderingContext2D, newLayout: Rect, parent?: BaseConfig | undefined): void {
    let {
      radius,
      fontWeight,
      fontSize,
      fontFamily,
      brokenTexts,
      textAlign,
      textLineHeight
    } = this._config
    let {x, y, w, h} = newLayout
    // ctx.fillStyle = 'white'
    ctx.font = `${fontWeight} ${fontSize}rem "${fontFamily}", sans-serif`
    ctx.textBaseline = 'top'
    // ctx.textAlign = rect.textAlign

    // console.log('render', rect.texts)
    brokenTexts?.map((text, index) => {
      let lX = x
      if (textAlign === TextAlign.CENTER) {
        let m = ctx.measureText(text)
        lX = x + w / 2 - m.width / 2
      }
      if (textAlign === TextAlign.RIGHT) {
        let m = ctx.measureText(text)
        lX = x + w - m.width
      }
      text && ctx.fillText(text, lX, y + (index * textLineHeight))
    })
  }

  drawHover(ctx: CanvasRenderingContext2D, newLayout: Rect) {
    let {x, y, w, h,} = newLayout
    ctx.rect(x, y, w, h)
    ctx.strokeStyle = Colors.Primary
    ctx.stroke()
  }

  drawSelected(ctx: CanvasRenderingContext2D, newLayout: Rect) {
    draw.selected(ctx, newLayout)
  }

}