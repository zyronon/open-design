import {MouseEvent, useEffect, useRef, useState} from 'react'
import './App.css'
import {TextAlign} from "../../src/lib/designer/config/TextConfig"
import {TextMode} from "../../src/pages/canvas-old/type"


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
      text: 'j',
      x: 0,
      width: 10,
      fontSize: 20,
      lineHeight: 20,
      fontWeight: '400',
      fontFamily: 'sans-serif',
    },
    {
      text: 'j',
      x: 0,
      width: 10,
      fontSize: 20,
      lineHeight: 20,
      fontWeight: '400',
      fontFamily: 'sans-serif',
    },
    {
      text: 'a',
      x: 0,
      width: 10,
      fontSize: 20,
      lineHeight: 20,
      fontWeight: '400',
      fontFamily: 'sans-serif',
    },
    {
      text: 'b',
      x: 0,
      width: 10,
      fontSize: 20,
      lineHeight: 20,
      fontWeight: '400',
      fontFamily: 'sans-serif',
    },
    {
      text: 'c',
      x: 0,
      width: 10,
      fontSize: 20,
      lineHeight: 20,
      fontWeight: '400',
      fontFamily: 'sans-serif',
    },
    {
      text: 'd',
      x: 0,
      width: 10,
      fontSize: 20,
      lineHeight: 20,
      fontWeight: '400',
      fontFamily: 'sans-serif',
    },
  ],
  [
    {
      text: 'j',
      x: 0,
      width: 10,
      fontSize: 20,
      lineHeight: 20,
      fontWeight: '400',
      fontFamily: 'sans-serif',
    },
    {
      text: 'j',
      x: 0,
      width: 10,
      fontSize: 20,
      lineHeight: 20,
      fontWeight: '400',
      fontFamily: 'sans-serif',
    },
    {
      text: 'a',
      x: 0,
      width: 10,
      fontSize: 20,
      lineHeight: 20,
      fontWeight: '400',
      fontFamily: 'sans-serif',
    },
    {
      text: 'b',
      x: 0,
      width: 10,
      fontSize: 20,
      lineHeight: 20,
      fontWeight: '400',
      fontFamily: 'sans-serif',
    },
    {
      text: 'c',
      x: 0,
      width: 10,
      fontSize: 20,
      lineHeight: 20,
      fontWeight: '400',
      fontFamily: 'sans-serif',
    },
    {
      text: 'd',
      x: 0,
      width: 10,
      fontSize: 20,
      lineHeight: 20,
      fontWeight: '400',
      fontFamily: 'sans-serif',
    },
  ]
]
let conf: any = {
  texts: [],
  brokenTexts,
  textAlign: TextAlign.LEFT,
  textLineHeight: 40,
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
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>(null as any)

  function render(texts: Text[][], ctx: CanvasRenderingContext2D) {
    let {layout: {x, y, w, h,}, center} = conf
    ctx.clearRect(0, 0, 400, 400)
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
    ctx.strokeStyle = '#e1e1e1'
    ctx.strokeRect(-w2, -h2, w, h)
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

  function onChange(e: any) {
    let value = e.target.value
    let val = e.nativeEvent.data
    let lastRow = conf.brokenTexts[conf.brokenTexts.length - 1]
    let last = lastRow[lastRow.length - 1]
    ctx.save()
    let {fontWeight, fontSize, lineHeight, fontFamily} = last
    ctx.font = `${fontWeight} ${fontSize}px/${lineHeight}px ${fontFamily}`
    let b = ctx.measureText(val)
    let newText: Text = clone(last)
    newText.text = val
    newText.x = last.x + last.width
    newText.width = b.width
    lastRow.push(newText)
    ctx.restore()
    // calc(ctx)
    render(conf.brokenTexts, ctx)
  }

  const cursor = useRef<HTMLDivElement>(null as any)

  function onClick(e: MouseEvent) {
    let ex = e.clientX - canvasRect.left;
    let ey = e.clientY - canvasRect.top;
    let {layout: {x, y, w, h}, textAlign, textLineHeight, center, brokenTexts} = conf
    // console.log('e', ex, ey)

    let cx = ex - center.x
    let cy = ey - center.y

    // console.log('e', cx, cy)

    let w2 = conf.layout.w / 2
    let h2 = conf.layout.h / 2
    let lineHeight = 20
    let lineIndex = undefined
    let xIndex = undefined
    for (let i = 0; i < brokenTexts.length; i++) {
      // console.log('i', i)
      lineIndex = (ey / lineHeight).toFixed(0)
      let row = brokenTexts[lineIndex]
      if (row) {
        let isBreak = false
        for (let j = 0; j < row.length; j++) {
          let item = row[j]
          let abs = Math.abs(item.x - cx)
          console.log('item.x', item.x)
          console.log('cx', cx)
          console.log('abs', abs)
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

    if (lineIndex && xIndex) {
      cursor.current.style.top = lineHeight * Number(lineIndex) + 'px'
      let left = brokenTexts[lineIndex][xIndex].x
      left += center.x
      cursor.current.style.left = left + 'px'
    }
    console.log('lineIndex', lineIndex)
    console.log('xIndex', xIndex)
  }

  return (
    <>
      <div className={'canvasWrapper'}>
        <canvas width={400} height={400}
                onClick={onClick}
                ref={ref}/>
        <div className={'cursor'} ref={cursor}></div>
      </div>
      <textarea onChange={onChange}></textarea>
    </>
  )
}

export default App
