import {BaseShape} from "./BaseShape"
import CanvasUtil2 from "../CanvasUtil2"
import {P, TextAlign, TextConfig} from "../type"

export class Text extends BaseShape {
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

  get _config(): TextConfig {
    return this.config as TextConfig
  }

  set _config(val) {
    this.config = val
  }

  render(ctx: CanvasRenderingContext2D, p: P, parent?: any): any {
    let {
      w, h, radius,
      fontWeight,
      fontSize,
      fontFamily,
      brokenTexts,
      textAlign,
      textLineHeight
    } = this._config
    const {x, y} = p
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

  renderSelectedHover(ctx: CanvasRenderingContext2D, conf: any): void {
  }

}