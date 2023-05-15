import {useEffect, useRef, useState} from 'react'
import './App.css'
import {TextAlign} from "../../src/lib/designer/config/TextConfig"
import {TextMode} from "../../src/pages/canvas-old/type"
import helper from "../../src/lib/designer/utils/helper"

class Text {

  drawText() {

  }
}

let conf: any = {
  brokenTexts: [],
  texts: [],
  layout: {
    x: 0,
    y: 0,
    w: 100,
    h: 100,
  },
  center: {
    x: 0,
    y: 0,
  }
}
let original: any = {
  layout: {
    x: 0,
    y: 0,
    w: 100,
    h: 100,
  }
}

function getTextModeAutoHTexts(texts: string[], ctx: any, w: number) {
  let newTexts: string[] = []
  for (let i = 0; i < texts.length; i++) {
    let text = texts[i]
    if (!text) {
      newTexts.push(text)
      continue
    }
    let measureText = ctx.measureText(text)
    if (measureText.width <= w) {
      newTexts.push(text)
    } else {
      for (let i = text.length - 1; i >= 0; i--) {
        measureText = ctx.measureText(text.substring(0, i))
        if (measureText.width <= w) {
          newTexts.push(text.substring(0, i))
          let res = getTextModeAutoHTexts([text.substring(i, text.length)], ctx, w)
          newTexts = newTexts.concat(res)
          break
        }
      }
    }
  }
  return newTexts
}

function App() {
  const ref = useRef(null)
  const [ctx, setCtx] = useState<any>(null)

  function render(texts: string[]) {
    let {x, y, w, h,} = conf.layout

    console.log('texts', texts)
    let fontWeight = '400'
    let fontSize = '20'
    let textLineHeight = 20
    let textMode = TextMode.AUTO_W
    let textAlign = TextAlign.LEFT
    ctx.font = `${fontWeight} ${fontSize}px/20px`
    // ctx.textBaseline = 'top'
    ctx.textBaseline = 'middle'
    // ctx.textAlign = rect.textAlign

    // console.log('render', rect.texts)

    conf.brokenTexts = texts
    conf.texts = texts
    if (textMode === TextMode.AUTO_W) {
      let widths = texts.map((text: string) => {
        let measureText = ctx.measureText(text)
        return measureText.width
      })
      let {w: ow, h: oh} = original.layout
      let maxW = Math.max(...widths)
      let newH = conf.brokenTexts.length * textLineHeight
      //老中心点加上w\h的增量除2，就是新中心
      conf.center.x = original.center.x + (maxW - ow) / 2
      conf.center.y = original.center.y + (newH - oh) / 2
      conf.layout.w = maxW
      conf.layout.h = newH
      conf.brokenTexts = texts
    }
    if (textMode === TextMode.AUTO_H) {
      conf.brokenTexts = getTextModeAutoHTexts(texts, ctx, w)
      console.log('brokenTexts', conf.brokenTexts)
      let {h: oh} = original.layout
      let newH = conf.brokenTexts.length * textLineHeight
      conf.center.y = original.center.y + (newH - oh) / 2
      conf.layout.h = conf.brokenTexts.length * textLineHeight
    }

    let w2 = w / 2
    conf.brokenTexts.map((text: string, index: number) => {
      let m = ctx.measureText(text)
      let lX = x
      if (textAlign === TextAlign.CENTER) {
        lX = x + w2 - m.width / 2
      }
      if (textAlign === TextAlign.RIGHT) {
        lX = x + w - m.width
      }
      if (textAlign === TextAlign.LEFT) {
        lX = -w2
      }
      text && ctx.fillText(text, lX, y + 10 + (index * textLineHeight))
    })
  }

  useEffect(() => {
    if (ref.current) {
      let canvas: any = ref.current
      let ctx: CanvasRenderingContext2D = canvas.getContext('2d')!
      let canvasRect = canvas.getBoundingClientRect()
      let {width, height} = canvasRect
      let dpr = window.devicePixelRatio
      if (dpr) {
        canvas.style.width = width + "px"
        canvas.style.height = height + "px"
        canvas.height = height * dpr
        canvas.width = width * dpr
        ctx.scale(dpr, dpr)
      }
      setCtx(ctx)

      let {x, y, w, h,} = conf.layout
      conf.center = {
        x: x + w / 2,
        y: y + h / 2
      }
      original = JSON.parse(JSON.stringify(conf))
    }
  }, [ref.current])

  function onChange(e: any) {
    render(e.target.value.split('\n'))
  }

  return (
    <>
      <canvas width={500} height={500} ref={ref}/>
      <textarea onChange={onChange}></textarea>
    </>
  )
}

export default App
