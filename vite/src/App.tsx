import {KeyboardEvent, MouseEvent, useEffect, useRef, useState} from 'react'
import './App.css'
import {TextAlign} from "../../src/lib/designer/config/TextConfig"
import {TextMode} from "../../src/pages/canvas-old/type"
import {Rect} from "../../src/lib/designer/config/BaseConfig";
import {P} from "../../src/lib/designer/types/type";
import {message} from "antd";


type Text = {
  text: string,
  width: number,
  x: number,
  fontSize: number,
  lineHeight: number,
  fontWeight: string
  fontFamily: string
}
type Texts = Text[][]

let brokenTexts: Texts = [
  [
    {
      "text": "j",
      "x": -100,
      "width": 5.341796875,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "1",
      "x": -94.658203125,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "2",
      "x": -82.9296875,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "3",
      "x": -71.201171875,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "3",
      "x": -59.47265625,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "3",
      "x": -47.744140625,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "3",
      "x": -36.015625,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "3",
      "x": -24.287109375,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "3",
      "x": -12.55859375,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "3",
      "x": -0.830078125,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "3",
      "x": 10.8984375,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "3",
      "x": 22.626953125,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "3",
      "x": 34.35546875,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "3",
      "x": 46.083984375,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": " ",
      "x": -100,
      "width": 5.91796875,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    }
  ],
  [
    {
      "text": "4",
      "x": -100,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "4",
      "x": -88.271484375,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "4",
      "x": -76.54296875,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "4",
      "x": -64.814453125,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "4",
      "x": -53.0859375,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "4",
      "x": -41.357421875,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "4",
      "x": -29.62890625,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "4",
      "x": -17.900390625,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "4",
      "x": -6.171875,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "4",
      "x": 5.556640625,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "4",
      "x": 17.28515625,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "4",
      "x": 29.013671875,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "4",
      "x": 40.7421875,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": " ",
      "x": -100,
      "width": 5.91796875,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    }
  ],
  [
    {
      "text": "5",
      "x": -100,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "5",
      "x": -88.271484375,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "5",
      "x": -76.54296875,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "5",
      "x": -64.814453125,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "5",
      "x": -53.0859375,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "5",
      "x": -41.357421875,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "5",
      "x": -29.62890625,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "5",
      "x": -17.900390625,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "5",
      "x": -6.171875,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "5",
      "x": 5.556640625,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "5",
      "x": 17.28515625,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "5",
      "x": 29.013671875,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "5",
      "x": 40.7421875,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": " ",
      "x": -100,
      "width": 5.91796875,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    }
  ],
  [
    {
      "text": "6",
      "x": -100,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "6",
      "x": -88.271484375,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "6",
      "x": -76.54296875,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "6",
      "x": -64.814453125,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "6",
      "x": -53.0859375,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "6",
      "x": -41.357421875,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "6",
      "x": -29.62890625,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "6",
      "x": -17.900390625,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "6",
      "x": -6.171875,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "6",
      "x": 5.556640625,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "6",
      "x": 17.28515625,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "6",
      "x": 29.013671875,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "6",
      "x": 40.7421875,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": " ",
      "x": -100,
      "width": 5.91796875,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    }
  ],
  [
    {
      "text": "7",
      "x": -100,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "7",
      "x": -88.271484375,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "7",
      "x": -76.54296875,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "7",
      "x": -64.814453125,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "7",
      "x": -53.0859375,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "7",
      "x": -41.357421875,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "7",
      "x": -29.62890625,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "7",
      "x": -17.900390625,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "7",
      "x": -6.171875,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "7",
      "x": 5.556640625,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "7",
      "x": 17.28515625,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "7",
      "x": 29.013671875,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "7",
      "x": 40.7421875,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "7",
      "x": 52.470703125,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": " ",
      "x": -100,
      "width": 5.91796875,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    }
  ],
  [
    {
      "text": "8",
      "x": -100,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "8",
      "x": -88.271484375,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "8",
      "x": -76.54296875,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "8",
      "x": -64.814453125,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "8",
      "x": -53.0859375,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "8",
      "x": -41.357421875,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "8",
      "x": -29.62890625,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "8",
      "x": -17.900390625,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "8",
      "x": -6.171875,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "8",
      "x": 5.556640625,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "8",
      "x": 17.28515625,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "8",
      "x": 29.013671875,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    },
    {
      "text": "8",
      "x": 40.7421875,
      "width": 11.728515625,
      "fontSize": 20,
      "lineHeight": 20,
      "fontWeight": "400",
      "fontFamily": "sans-serif"
    }
  ]
]
// brokenTexts = [[{
//   "text": "j",
//   "x": -100,
//   "width": 5.341796875,
//   "fontSize": 20,
//   "lineHeight": 20,
//   "fontWeight": "400",
//   "fontFamily": "sans-serif"
// },]]

type Conf = {
  texts: any[],
  brokenTexts: Texts,
  lan: Rect[],
  textAlign: TextAlign,
  textLineHeight: number,
  layout: Rect,
  center: P,
}
let conf: Conf = {
  texts: [],
  brokenTexts,
  lan: [],
  textAlign: TextAlign.LEFT,
  textLineHeight: 40,
  layout: {
    x: 0,
    y: 0,
    w: 200,
    h: 200,
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

type LanInfo = {
  lineIndex: number,
  xIndex: number
}

function App() {
  const ref = useRef(null)
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>(null as any)

  function render(texts: Text[][], ctx: CanvasRenderingContext2D) {
    let {layout: {x, y, w, h,}, center, lan} = conf
    ctx.clearRect(0, 0, 400, 400)
    ctx.fillStyle = 'rgb(239,239,239)'
    ctx.fillRect(0, 0, 400, 400)
    console.log('render', texts)

    let textLineHeight = 20
    ctx.textBaseline = 'top'
    // ctx.textBaseline = 'middle'
    // ctx.textBaseline = 'bottom'
    // ctx.textAlign = rect.textAlign
    ctx.save()

    conf.brokenTexts = texts
    // if (textMode === TextMode.AUTO_W) {
    //   let widths = texts.map((text: string) => {
    //     let measureText = ctx.measureText(text)
    //     return measureText.width
    //   })
    //   let {w: ow, h: oh} = original.layout
    //   let maxW = Math.max(...widths)
    //   let newH = conf.brokenTexts.length * textLineHeight
    //   //老中心点加上w\h的增量除2，就是新中心
    //   conf.center.x = original.center.x + (maxW - ow) / 2
    //   conf.center.y = original.center.y + (newH - oh) / 2
    //   conf.layout.w = maxW
    //   conf.layout.h = newH
    //   console.log(conf)
    // }
    // if (textMode === TextMode.AUTO_H) {
    //   conf.brokenTexts = getTextModeAutoHTexts(texts, ctx, w)
    //   console.log('brokenTexts', conf.brokenTexts)
    //   let {h: oh} = original.layout
    //   let newH = conf.brokenTexts.length * textLineHeight
    //   conf.center.y = original.center.y + (newH - oh) / 2
    //   conf.layout.h = conf.brokenTexts.length * textLineHeight
    // }
    ctx.translate(conf.center.x, conf.center.y)

    let w2 = conf.layout.w / 2
    let h2 = conf.layout.h / 2
    ctx.strokeStyle = '#ababab'
    ctx.strokeRect(-w2, -h2, w, h)

    ctx.fillStyle = 'rgb(184,197,238)'
    lan.map((value) => {
      ctx.fillRect(value.x, value.y, value.w, value.h)
    })
    ctx.fillStyle = 'rgb(158,158,158)'

    conf.brokenTexts.map((row: Text[], i: number) => {
      row.map((obj: Text, j: number) => {
        let {fontWeight, fontSize, lineHeight, fontFamily} = obj
        ctx.font = `${fontWeight} ${fontSize}px/${lineHeight}px ${fontFamily}`
        let lY = -h2 + (i * textLineHeight)
        ctx.fillText(obj.text, obj.x, lY)
      })
    })
    ctx.restore()
    original = JSON.parse(JSON.stringify(conf))
    // console.log('texts', texts)
  }

  function calc(ctx: CanvasRenderingContext2D) {
    let {layout: {x, y, w, h}, textAlign, textLineHeight} = conf
    let w2 = w / 2
    let h2 = h / 2
    ctx.save()
    conf.brokenTexts.map((row: Text[], i: number) => {
      let rowX = -w2
      row.map((obj: Text, j: number) => {
        let {fontWeight, fontSize, lineHeight, fontFamily} = obj
        ctx.font = `${fontWeight} ${fontSize}px/${lineHeight}px ${fontFamily}`
        let b = ctx.measureText(obj.text)
        conf.brokenTexts[i][j].x = rowX
        conf.brokenTexts[i][j].width = b.width
        rowX += b.width
      })
    })
    ctx.restore()
    // console.log('conf.brokenTexts', conf.brokenTexts)
  }

  function clone(val: any) {
    return JSON.parse(JSON.stringify(val))
  }

  const [canvasRect, setCanvasRect] = useState<DOMRect>(null as any)

  useEffect(() => {
    if (ref.current) {
      let canvas: HTMLCanvasElement = ref.current
      let ctx: CanvasRenderingContext2D = canvas.getContext('2d')!
      let canvasRect = canvas.getBoundingClientRect()
      setCanvasRect(canvasRect)
      let {width, height} = canvasRect
      let dpr = window.devicePixelRatio
      if (dpr) {
        // if (false) {
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
      setTimeout(() => {
        calc(ctx)
        render(conf.brokenTexts, ctx)
      })
    }
  }, [ref.current])

  function onTextKeyDown(e: any) {
    let lastRow = conf.brokenTexts[conf.brokenTexts.length - 1]
    switch (e.keyCode) {
      //删除
      case 8:
        if (lastRow.length) {
          lastRow.pop()
        } else {
          let preLine = conf.brokenTexts[conf.brokenTexts.length - 2]
          preLine.pop()
          conf.brokenTexts.pop()
        }
        render(conf.brokenTexts, ctx)
        break
      //回车
      case 13:
        let last = lastRow[lastRow.length - 1]
        let {fontWeight, fontSize, lineHeight, fontFamily} = last
        ctx.save()
        ctx.font = `${fontWeight} ${fontSize}px/${lineHeight}px ${fontFamily}`
        let b = ctx.measureText(' ')
        let newText: Text = clone(last)
        newText.text = ' '
        newText.x = last.x + last.width
        // newText.x = -conf.layout.w / 2
        newText.width = b.width
        lastRow.push(newText)
        conf.brokenTexts.push([])
        ctx.restore()
        render(conf.brokenTexts, ctx)
        break
    }
  }

  function onChange(e: any) {
    let val = e.nativeEvent.data
    //删除和回车都是等于null
    if (val === null) return
    let lastRow = conf.brokenTexts[conf.brokenTexts.length - 1]
    let last
    if (lastRow.length) {
      last = lastRow[lastRow.length - 1]
    } else {
      let preLine = conf.brokenTexts[conf.brokenTexts.length - 2]
      last = preLine[preLine.length - 1]
    }
    ctx.save()
    let {fontWeight, fontSize, lineHeight, fontFamily} = last
    ctx.font = `${fontWeight} ${fontSize}px/${lineHeight}px ${fontFamily}`
    let b = ctx.measureText(val)
    let newText: Text = clone(last)
    newText.text = val
    if (lastRow.length) {
      newText.x = last.x + last.width
    } else {
      newText.x = -conf.center.x
    }
    newText.width = b.width
    lastRow.push(newText)
    ctx.restore()
    // calc(ctx)
    render(conf.brokenTexts, ctx)
  }

  const cursor = useRef<HTMLDivElement>(null as any)

  const [position, setPosition] = useState<LanInfo>(null as any)

  const [newPosition, setNewPosition] = useState<LanInfo>(null as any)

  const isEnter = useRef<boolean>(false)

  function getPosition(e: MouseEvent): LanInfo {
    let ex = e.clientX - canvasRect.left;
    let ey = e.clientY - canvasRect.top;
    let {layout: {x, y, w, h}, textAlign, textLineHeight, center, brokenTexts} = conf
    // console.log('e', ex, ey)

    let cx = ex - center.x
    let cy = ey - center.y

    // console.log('e', cx, cy)

    let lineHeight = 20
    let lineIndex = undefined
    let xIndex = undefined
    for (let i = 0; i < brokenTexts.length; i++) {
      // console.log('i', i)
      lineIndex = Number((ey / lineHeight).toFixed(0))
      let row = brokenTexts[lineIndex]
      if (row) {
        let isBreak = false
        for (let j = 0; j < row.length; j++) {
          let item = row[j]
          let abs = Math.abs(item.x - cx)
          //console.log('item.x', item.x)
          //console.log('cx', cx)
          //console.log('abs', abs)
          if (abs <= item.width) {
            xIndex = j
            isBreak = true
            break
          }
          // console.log('j', j)
        }
        if (isBreak) break
      }
    }

    if (lineIndex !== undefined && xIndex !== undefined) {
      return {lineIndex, xIndex}
    }
    return null as any
  }

  function onMouseDown(e: MouseEvent) {
    let position = getPosition(e)
    if (position) {
      let {lineIndex, xIndex} = position
      let {layout: {x, y, w, h}, textAlign, textLineHeight, center, brokenTexts} = conf
      let lineHeight = 20
      isEnter.current = true
      cursor.current.style.top = lineHeight * Number(lineIndex) + 'px'
      let left = brokenTexts[lineIndex][xIndex].x
      left += center.x
      cursor.current.style.left = left + 'px'
      setPosition({lineIndex, xIndex})
      conf.lan = []
      render(conf.brokenTexts, ctx)

      console.log('lineIndex', lineIndex)
      console.log('xIndex', xIndex)
    }
  }

  function onMouseMove(e: MouseEvent) {
    if (isEnter.current) {
      let ex = e.clientX - canvasRect.left;
      let ey = e.clientY - canvasRect.top;
      let {lineIndex, xIndex} = position
      let {layout: {x, y, w, h}, textAlign, textLineHeight, center, brokenTexts} = conf
      let cx = ex - center.x
      let cy = ey - center.y
      let newPosition = getPosition(e)
      let lineHeight = 20

      if (newPosition) {
        setNewPosition(newPosition)
        let newLineIndex = newPosition.lineIndex
        let newXIndex = newPosition.xIndex
        let minXIndex = Math.min(newXIndex, xIndex)
        let maxXIndex = Math.max(newXIndex, xIndex)
        let minLineIndex = Math.min(newLineIndex, lineIndex)
        let maxLineIndex = Math.max(newLineIndex, lineIndex)

        cursor.current.style.top = lineHeight * Number(newLineIndex) + 'px'
        let left = brokenTexts[newLineIndex][newXIndex].x
        left += center.x
        cursor.current.style.left = left + 'px'

        let start = position
        let end = newPosition

        let lan = []
        if (newLineIndex === lineIndex) {
          let line = conf.brokenTexts[lineIndex]
          let lineFirst = line[minXIndex]
          let lineLast = line[maxXIndex]

          let rect = {
            x: line[minXIndex].x,
            y: lineIndex * lineHeight - center.y,
            w: Math.abs(lineLast.x + lineLast.width - lineFirst.x),
            h: lineHeight
          }
          lan = [rect]
        } else {
          if (newLineIndex < lineIndex) {
            start = newPosition
            end = position
          }
          let startLine = conf.brokenTexts[start.lineIndex]
          let startLineLast = startLine[startLine.length - 1];
          console.log('start', start)
          console.log('startLineLast', startLineLast)
          let startRect = {
            x: startLine[start.xIndex].x,
            y: start.lineIndex * lineHeight - center.y,
            w: Math.abs(startLineLast.x + startLineLast.width - startLine[start.xIndex].x),
            h: lineHeight
          }

          let endLine = conf.brokenTexts[end.lineIndex]
          let endLineFirst = endLine[0]
          let endRect = {
            x: endLineFirst.x,
            y: end.lineIndex * lineHeight - center.y,
            w: Math.abs(endLine[end.xIndex].x - endLineFirst.x),
            h: lineHeight
          }

          lan = [startRect, endRect]
          for (let i = minLineIndex + 1; i < maxLineIndex; i++) {
            let row = conf.brokenTexts[i]
            lan.push({
              x: row[0].x,
              y: i * lineHeight - center.y,
              w: Math.abs(row[row.length - 1].x + row[row.length - 1].width - row[0].x),
              h: lineHeight
            })
          }
        }

        console.log('lan', JSON.stringify(lan, null, 2))
        conf.lan = lan
        render(conf.brokenTexts, ctx)
      }
      // console.log('e', ex, ey)
    }
  }

  function onMouseUp() {
    isEnter.current = false
  }

  function getConfig() {
    console.log(conf.brokenTexts)
    navigator.clipboard.writeText(JSON.stringify(conf.brokenTexts, null, 2))
      .then(() => {
        message.success('复制成功')
      })
  }

  function changeSize() {
    let {lineIndex, xIndex} = position
    // let {lineIndex, xIndex} = newPosition

    let newLineIndex = newPosition.lineIndex
    let newXIndex = newPosition.xIndex
    let minXIndex = Math.min(newXIndex, xIndex)
    let maxXIndex = Math.max(newXIndex, xIndex)
    let minLineIndex = Math.min(newLineIndex, lineIndex)
    let maxLineIndex = Math.max(newLineIndex, lineIndex)

    for (let i = minLineIndex; i <= maxLineIndex; i++) {
      let line = conf.brokenTexts[i]
      let startIndex = 0
      let endIndex = line.length
      if (i === minLineIndex) {
        if (i === lineIndex) {
          startIndex = xIndex
        }
        if (i === newLineIndex) {
          startIndex = newXIndex
        }
      }
      if (i === maxLineIndex) {
        if (i === lineIndex) {
          endIndex = xIndex
        }
        if (i === newLineIndex) {
          endIndex = newXIndex
        }
      }

      line.slice(startIndex, endIndex).map(value => {
        value.fontSize++
        value.lineHeight = value.fontSize + 2
      })
    }

    f()

  }

  function f() {
    render(conf.brokenTexts, ctx)
  }

  return (
    <>
      <div className={'canvasWrapper'}>
        <canvas width={400} height={400}
                tabIndex={1}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                ref={ref}/>
        <div className={'cursor'} ref={cursor}></div>
      </div>
      <div className="bottom">
        <button onClick={getConfig}>字</button>
        <button onClick={changeSize}>变大</button>
      </div>
      <textarea
        onKeyDown={onTextKeyDown}
        onChange={onChange}></textarea>
    </>
  )
}

export default App
