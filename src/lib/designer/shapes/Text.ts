import {TextAlign, TextConfig} from "../config/TextConfig"
import {BaseConfig, Rect} from "../config/BaseConfig"
import {ParentShape} from "./core/ParentShape";
import draw from "../utils/draw"
import {Colors, defaultConfig} from "../utils/constant"
import {BaseEvent2} from "../types/type";
import {BaseShape} from "./core/BaseShape";
import {Cancer} from "@icon-park/react";
import CanvasUtil2, {CU} from "../engine/CanvasUtil2";
import {TextMode} from "../../../pages/canvas-old/type";

export class Text extends ParentShape {

  get _config(): TextConfig {
    return this.conf as TextConfig
  }

  set _config(val) {
    this.conf = val
  }

  onDbClick(event: BaseEvent2, parents: BaseShape[]): boolean {
    let {x, y, w, h,} = this._config.layout

    let cu = CanvasUtil2.getInstance()
    let id = 'text-input'
    let input: HTMLElement = document.querySelector('#' + id) ?? document.createElement('textarea')
    input.id = id
    input.classList.add('canvas-text-input')
    input.style.top = y + cu.canvasRect.top + 150 + 'px'
    input.style.left = x + cu.canvasRect.left + 'px'
    input.style.fontSize = '20rem'
    // @ts-ignore
    input.value = this._config.texts!.join('\n')
    document.body.append(input)
    input.focus()
    input.oninput = (val: any) => {
      let newValue = val.target.value
      console.log('newValue', newValue)
      let texts = newValue.split('\n')
      this.calcText(texts)
    }
    return super.onDbClick(event, parents);
  }

  calcText(texts: string[]) {
    console.log('text', texts)
    let {textMode, textLineHeight} = this.conf
    let {x, y, w, h,} = this.conf.layout
    let ctx = CU.i().ctx
    this.conf.brokenTexts = texts
    this.conf.texts = texts
    if (textMode === TextMode.AUTO_W) {
      let widths = texts.map((text: string) => {
        let measureText = ctx.measureText(text)
        return measureText.width
      })
      this.conf.layout.w = Math.max(...widths)
      this.conf.layout.h = texts.length * textLineHeight
      this.conf.brokenTexts = texts
    }
    if (textMode === TextMode.AUTO_H) {
      this.conf.brokenTexts = this.getTextModeAutoHTexts(texts, ctx, w)
      this.conf.layout.h = this.conf.brokenTexts.length * textLineHeight
    }
    this.notifyConfUpdate()
    CU.r()
  }

  getTextModeAutoHTexts(texts: string[], ctx: any, w: number) {
    let newTexts: string[] = []
    for (let i = 0; i < texts.length; i++) {
      let text = texts[i]
      if (!text) continue
      let measureText = ctx.measureText(text)
      if (measureText.width <= w) {
        newTexts.push(text)
      } else {
        for (let i = text.length - 1; i >= 0; i--) {
          measureText = ctx.measureText(text.substring(0, i))
          if (measureText.width <= w) {
            newTexts.push(text.substring(0, i))
            let res = this.getTextModeAutoHTexts([text.substring(i, text.length)], ctx, w)
            newTexts = newTexts.concat(res)
            break
          }
        }
      }
    }
    return newTexts
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

  drawText(ctx: CanvasRenderingContext2D, newLayout: Rect) {
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

  drawEdit(ctx: CanvasRenderingContext2D, newLayout: Rect) {
    let {x, y, w, h,} = newLayout
    ctx.strokeStyle = defaultConfig.strokeStyle

    ctx.beginPath()
    ctx.rect(x, y, w, h)
    ctx.closePath()
    ctx.stroke()

    this.drawText(ctx, newLayout)
  }
}