import {BaseShape} from "./BaseShape"
import CanvasUtil2 from "../CanvasUtil2"
import {BaseEvent2, P, ShapeConfig, TextAlign, TextConfig} from "../type"

export class Text extends BaseShape {
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

  get _config(): TextConfig {
    return this.config as TextConfig
  }

  set _config(val) {
    this.config = val
  }
  render(ctx: CanvasRenderingContext2D, xy: P, parent?: ShapeConfig): any {
    let {
      w, h, radius,
      fontWeight,
      fontSize,
      fontFamily,
      brokenTexts,
      textAlign,
      textLineHeight
    } = this._config
    const {x, y} = xy
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

  renderHover(ctx: CanvasRenderingContext2D,xy: P, parent?: ShapeConfig): void {}
  renderSelected(ctx: CanvasRenderingContext2D,xy: P, parent?: ShapeConfig): void {}
  renderEdit(ctx: CanvasRenderingContext2D,xy: P, parent?: ShapeConfig): void {}
  renderSelectedHover(ctx: CanvasRenderingContext2D, conf: any): void {
  }

}