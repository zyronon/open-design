import {MouseEvent, useEffect, useRef, useState} from 'react'
import './App.css'
import {TextAlign} from "../../src/lib/designer/config/TextConfig"
import {Rect} from "../../src/lib/designer/config/BaseConfig";
import {P} from "../../src/lib/designer/types/type";
import {message} from "antd";


type TextInfo = {
  fontSize: number,
  lineHeight: number,
  fontWeight: string
  fontFamily: string
}
type Text = {
  text: string,
  width: number,
  x: number,
} & TextInfo
type TextLine = {
  maxLineHeight: number,
  children: Text[]
}

let brokenTexts: TextLine[] = [
  {
    maxLineHeight: 17,
    children: [
      {
        text: 'j',
        width: 10,
        x: -100,
        fontSize: 20,
        lineHeight: 28.5,
        fontWeight: '500',
        fontFamily: 'sans-serif'
      }
    ]
  }
]
brokenTexts = [
  {
    "maxLineHeight": 40,
    "children": [
      {
        "text": "j",
        "width": 5.341796875,
        "x": -100,
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif"
      },
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "1",
        "x": -94.658203125,
        "width": 11.728515625
      },
      {
        "fontSize": 28,
        "lineHeight": 40,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "2",
        "x": -82.9296875,
        "width": 11.728515625
      },
      {
        "fontSize": 28,
        "lineHeight": 40,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "2",
        "x": -71.201171875,
        "width": 11.728515625
      },
      {
        "fontSize": 28,
        "lineHeight": 40,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "2",
        "x": -59.47265625,
        "width": 11.728515625
      },
      {
        "fontSize": 28,
        "lineHeight": 40,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "2",
        "x": -47.744140625,
        "width": 11.728515625
      },
      {
        "fontSize": 28,
        "lineHeight": 40,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "2",
        "x": -36.015625,
        "width": 11.728515625
      },
      {
        "fontSize": 28,
        "lineHeight": 40,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "2",
        "x": -24.287109375,
        "width": 11.728515625
      },
      {
        "fontSize": 28,
        "lineHeight": 40,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "2",
        "x": -12.55859375,
        "width": 11.728515625
      },
      {
        "fontSize": 28,
        "lineHeight": 40,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "2",
        "x": -0.830078125,
        "width": 11.728515625
      },
      {
        "fontSize": 28,
        "lineHeight": 40,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "2",
        "x": 10.8984375,
        "width": 11.728515625
      },
      {
        "fontSize": 28,
        "lineHeight": 40,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "2",
        "x": 22.626953125,
        "width": 11.728515625
      },
      {
        "fontSize": 28,
        "lineHeight": 40,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": " ",
        "x": 34.35546875,
        "width": 5.91796875
      }
    ]
  },
  {
    "maxLineHeight": 40,
    "children": [
      {
        "fontSize": 28,
        "lineHeight": 40,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "2",
        "x": -100,
        "width": 11.728515625
      },
      {
        "fontSize": 28,
        "lineHeight": 40,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "2",
        "x": -88.271484375,
        "width": 11.728515625
      },
      {
        "fontSize": 28,
        "lineHeight": 40,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "2",
        "x": -76.54296875,
        "width": 11.728515625
      },
      {
        "fontSize": 28,
        "lineHeight": 40,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "2",
        "x": -64.814453125,
        "width": 11.728515625
      },
      {
        "fontSize": 28,
        "lineHeight": 40,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "2",
        "x": -53.0859375,
        "width": 11.728515625
      },
      {
        "fontSize": 28,
        "lineHeight": 40,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "2",
        "x": -41.357421875,
        "width": 11.728515625
      },
      {
        "fontSize": 28,
        "lineHeight": 40,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": " ",
        "x": -29.62890625,
        "width": 5.91796875
      }
    ]
  },
  {
    "maxLineHeight": 40,
    "children": [
      {
        "fontSize": 28,
        "lineHeight": 40,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "2",
        "x": -100,
        "width": 11.728515625
      },
      {
        "fontSize": 28,
        "lineHeight": 40,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "2",
        "x": -88.271484375,
        "width": 11.728515625
      },
      {
        "fontSize": 28,
        "lineHeight": 40,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "2",
        "x": -76.54296875,
        "width": 11.728515625
      },
      {
        "fontSize": 28,
        "lineHeight": 40,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "2",
        "x": -64.814453125,
        "width": 11.728515625
      },
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "2",
        "x": -53.0859375,
        "width": 11.728515625
      },
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "2",
        "x": -41.357421875,
        "width": 11.728515625
      },
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "2",
        "x": -29.62890625,
        "width": 11.728515625
      },
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "2",
        "x": -17.900390625,
        "width": 11.728515625
      },
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "2",
        "x": -6.171875,
        "width": 11.728515625
      },
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": " ",
        "x": 5.556640625,
        "width": 5.91796875
      }
    ]
  },
  {
    "maxLineHeight": 28.5,
    "children": [
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "2",
        "x": -100,
        "width": 11.728515625
      },
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "2",
        "x": -88.271484375,
        "width": 11.728515625
      },
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "2",
        "x": -76.54296875,
        "width": 11.728515625
      },
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "2",
        "x": -64.814453125,
        "width": 11.728515625
      },
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "2",
        "x": -53.0859375,
        "width": 11.728515625
      }
    ]
  }
]

type Conf = {
  texts: any[],
  brokenTexts: TextLine[],
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

let currentTextInfo: TextInfo = {
  fontSize: 20,
  lineHeight: 28.5,
  fontWeight: '500',
  fontFamily: 'sans-serif'
}

function App() {
  const ref = useRef(null)
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>(null as any)

  function render(texts: TextLine[], ctx: CanvasRenderingContext2D) {
    let {layout: {x, y, w, h,}, center, lan} = conf
    ctx.clearRect(0, 0, 400, 400)
    ctx.fillStyle = 'rgb(239,239,239)'
    ctx.fillRect(0, 0, 400, 400)
    // console.log('render', texts)

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

    let lY = -h2
    conf.brokenTexts.map((row: TextLine) => {
      row.children.map((obj: Text,) => {
        let {fontWeight, fontSize, lineHeight, fontFamily} = obj
        ctx.font = `${fontWeight} ${fontSize}px/${lineHeight}px ${fontFamily}`
        ctx.fillText(obj.text, obj.x, lY)
      })
      lY = lY + row.maxLineHeight
      // console.log('lY', lY)
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
    conf.brokenTexts.map((row: TextLine, i: number) => {
      let rowX = -w2
      row.children.map((obj: Text, j: number) => {
        let {fontWeight, fontSize, lineHeight, fontFamily} = obj
        ctx.font = `${fontWeight} ${fontSize}px/${lineHeight}px ${fontFamily}`
        let b = ctx.measureText(obj.text)
        conf.brokenTexts[i].children[j].x = rowX
        conf.brokenTexts[i].children[j].width = b.width
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
        if (lastRow.children.length) {
          lastRow.children.pop()
        } else {
          let preLine = conf.brokenTexts[conf.brokenTexts.length - 2]
          preLine.children.pop()
          conf.brokenTexts.pop()
        }
        render(conf.brokenTexts, ctx)
        break
      //回车
      case 13:
        let last = lastRow.children[lastRow.children.length - 1]
        let {fontWeight, fontSize, lineHeight, fontFamily} = last
        ctx.save()
        ctx.font = `${fontWeight} ${fontSize}px/${lineHeight}px ${fontFamily}`
        let b = ctx.measureText(' ')
        let newText: Text = clone(last)
        newText.text = ' '
        newText.x = last.x + last.width
        // newText.x = -conf.layout.w / 2
        newText.width = b.width
        lastRow.children.push(newText)
        conf.brokenTexts.push({
          maxLineHeight: 0,
          children: []
        })
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
    if (lastRow.children.length) {
      last = lastRow.children[lastRow.children.length - 1]
    } else {
      let preLine = conf.brokenTexts[conf.brokenTexts.length - 2]
      last = preLine.children[preLine.children.length - 1]
    }
    ctx.save()
    let {fontWeight, fontSize, lineHeight, fontFamily} = currentTextInfo
    ctx.font = `${fontWeight} ${fontSize}px/${lineHeight}px ${fontFamily}`
    let b = ctx.measureText(val)
    let newText: Text = clone(currentTextInfo)
    newText.text = val
    if (lastRow.children.length) {
      newText.x = last.x + last.width
    } else {
      newText.x = -conf.center.x
    }
    newText.width = b.width
    lastRow.children.push(newText)
    lastRow.maxLineHeight = Math.max(...lastRow.children.map(v => v.lineHeight))
    ctx.restore()
    // calc(ctx)
    render(conf.brokenTexts, ctx)
  }

  const cursor = useRef<HTMLDivElement>(null as any)

  const [position, setPosition] = useState<LanInfo>(null as any)

  const [newPosition, setNewPosition] = useState<LanInfo>(null as any)

  const isEnter = useRef<boolean>(false)

  function getLineY(i: number, isCursor: boolean = true) {
    let {layout: {h}, brokenTexts} = conf
    let lY = isCursor ? 0 : -h / 2
    // console.log('brokenTexts.slice(i)',brokenTexts.slice(0,i))
    brokenTexts.slice(0, i).map(line => lY = lY + line.maxLineHeight)
    return lY
  }

  function getPosition(e: MouseEvent): LanInfo {
    let ex = e.clientX - canvasRect.left;
    let ey = e.clientY - canvasRect.top;
    let {layout: {x, y, w, h}, textAlign, textLineHeight, center, brokenTexts} = conf
    let cx = ex - center.x
    let cy = ey - center.y
    // console.log('e', cx, cy)
    let lineIndex = undefined
    let xIndex = undefined
    let lY = -h / 2
    for (let i = 0; i < brokenTexts.length; i++) {
      let line = brokenTexts[i]
      lY = lY + line.maxLineHeight
      // console.log('ey', ey, cy,lY)
      if (cy < lY) {
        // console.log('i',i)
        // break
        let isBreak = false
        for (let j = 0; j < line.children.length; j++) {
          let item = line.children[j]
          let abs = Math.abs(item.x - cx)
          //console.log('item.x', item.x)
          //console.log('cx', cx)
          //console.log('abs', abs)
          if (abs <= item.width) {
            xIndex = j
            lineIndex = i
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
      isEnter.current = true
      cursor.current.style.top = getLineY(lineIndex) + 'px'
      let left = brokenTexts[lineIndex].children[xIndex].x
      left += center.x
      cursor.current.style.left = left + 'px'
      setPosition({lineIndex, xIndex})
      conf.lan = []
      render(conf.brokenTexts, ctx)
      console.log('lineIndex', lineIndex, 'xIndex', xIndex)
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

        cursor.current.style.top = getLineY(newLineIndex) + 'px'
        let left = brokenTexts[newLineIndex].children[newXIndex].x
        left += center.x
        cursor.current.style.left = left + 'px'

        let start = position
        let end = newPosition

        let lan = []
        if (newLineIndex === lineIndex) {
          let line = conf.brokenTexts[lineIndex]
          let lineFirst = line.children[minXIndex]
          let lineLast = line.children[maxXIndex]

          let rect = {
            x: line.children[minXIndex].x,
            y: getLineY(lineIndex, false),
            w: Math.abs(lineLast.x + lineLast.width - lineFirst.x),
            h: line.maxLineHeight
          }
          lan = [rect]
        } else {
          if (newLineIndex < lineIndex) {
            start = newPosition
            end = position
          }
          let startLine = conf.brokenTexts[start.lineIndex]
          let startLineLast = startLine.children[startLine.children.length - 1];
          // console.log('start', start)
          // console.log('startLineLast', startLineLast)
          let startRect = {
            x: startLine.children[start.xIndex].x,
            y: getLineY(start.lineIndex, false),
            w: Math.abs(startLineLast.x + startLineLast.width - startLine.children[start.xIndex].x),
            h: startLine.maxLineHeight
          }

          let endLine = conf.brokenTexts[end.lineIndex]
          let endLineFirst = endLine.children[0]
          let endRect = {
            x: endLineFirst.x,
            y: getLineY(end.lineIndex, false),
            w: Math.abs(endLine.children[end.xIndex].x - endLineFirst.x),
            h: endLine.maxLineHeight
          }

          lan = [startRect, endRect]
          for (let i = minLineIndex + 1; i < maxLineIndex; i++) {
            let row = conf.brokenTexts[i]
            lan.push({
              x: row.children[0].x,
              y: getLineY(i, false),
              w: Math.abs(row.children[row.children.length - 1].x + row.children[row.children.length - 1].width - row.children[0].x),
              h: row.maxLineHeight
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
      let endIndex = line.children.length
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

      line.children.slice(startIndex, endIndex).map(value => {
        value.fontSize++
        value.lineHeight = Math.trunc(value.fontSize / 0.7)
      })
      line.maxLineHeight = Math.max(...line.children.map(v => v.lineHeight))
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
        <button onClick={getConfig}>配置</button>
        <button onClick={changeSize}>变大</button>
      </div>
      <textarea
        onKeyDown={onTextKeyDown}
        onChange={onChange}></textarea>
    </>
  )
}

export default App
