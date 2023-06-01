import {KeyboardEvent, MouseEvent, useEffect, useRef, useState} from 'react'
import './App.less'
import {TextAlign} from "../../src/lib/designer/config/TextConfig"
import {Rect} from "../../src/lib/designer/config/BaseConfig";
import {P, TextMode} from "../../src/lib/designer/types/type";
import {useMount} from "ahooks"
import {message} from "antd"

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
  newLine: boolean,
  children: Text[]
}

let brokenTexts: TextLine[] = []

type Conf = {
  texts: any[],
  brokenTexts: TextLine[],
  lan: Rect[],
  textAlign: TextAlign,
  textMode: TextMode,
  textLineHeight: number,
  layout: Rect,
  center: P,
}
let conf: Conf = {
  texts: [],
  brokenTexts,
  lan: [],
  textAlign: TextAlign.LEFT,
  textMode: TextMode.AUTO_H,
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

function clone<T>(val: T): T {
  return JSON.parse(JSON.stringify(val))
}

function App() {
  const ref = useRef(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>(null as any)
  const [canvasRect, setCanvasRect] = useState<DOMRect>(null as any)
  const cursor = useRef<HTMLDivElement>(null as any)
  const [position, setPosition] = useState<LanInfo>({
    lineIndex: 0,
    xIndex: 0
  })
  const [newPosition, setNewPosition] = useState<LanInfo>(null as any)
  const isEnter = useRef<boolean>(false)

  //计算
  function calc(ctx: CanvasRenderingContext2D) {
    ctx.save()
    conf.brokenTexts.map((row: TextLine, i: number) => {
      let rowX = 0
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

  function render(ctx: CanvasRenderingContext2D) {
    // console.log('render', conf.brokenTexts)
    let {layout: {x, y, w, h,}, center, lan} = conf
    ctx.clearRect(0, 0, 400, 400)
    ctx.fillStyle = 'rgb(239,239,239)'
    ctx.fillRect(0, 0, 400, 400)

    ctx.textBaseline = 'top'
    // ctx.textBaseline = 'middle'
    // ctx.textBaseline = 'bottom'
    // ctx.textAlign = rect.textAlign
    ctx.save()
    ctx.translate(conf.center.x, conf.center.y)

    let w2 = conf.layout.w / 2
    let h2 = conf.layout.h / 2
    ctx.strokeStyle = '#ababab'
    ctx.strokeRect(-w2, -h2, w, h)

    ctx.fillStyle = 'rgb(184,197,238)'
    lan.map((value) => {
      ctx.fillRect(-w2 + value.x, value.y, value.w, value.h)
    })
    ctx.fillStyle = 'rgb(158,158,158)'

    let lY = -h2
    conf.brokenTexts.map((row: TextLine) => {
      row.children.map((obj: Text,) => {
        let {fontWeight, fontSize, lineHeight, fontFamily} = obj
        ctx.font = `${fontWeight} ${fontSize}px/${lineHeight}px ${fontFamily}`
        ctx.fillText(obj.text, -w2 + obj.x, lY)
      })
      lY = lY + row.maxLineHeight
      // console.log('lY', lY)
    })
    ctx.restore()
    original = JSON.parse(JSON.stringify(conf))
  }

  function calcConf() {
    let {textMode, brokenTexts, center} = conf
    let {x, y, w, h,} = conf.layout

    if (textMode === TextMode.AUTO_W) {
      let maxW = Math.max(...conf.brokenTexts.map(line => {
        let last = line.children[line.children.length - 1]
        if (last) return last.x + last.width
        return 0
      }))
      conf.layout.w = maxW
      conf.layout.h = getLineY(conf.brokenTexts.length)
    }
    if (textMode === TextMode.AUTO_H) {
      let temp: TextLine[] = []
      brokenTexts.reduce((previousValue, line, currentIndex) => {
        let r = clone(line)
        if (currentIndex !== previousValue.length) {
          r.children.concat(previousValue.pop()!.children)
        }
        let more = adjustLineTextOnAutoH(r, w)
        previousValue.push(r)
        if (more.length) {
          previousValue.push({
            maxLineHeight: -1,
            newLine: false,
            children: more
          })
        }
        return previousValue
      }, temp)
      conf.brokenTexts = temp
    }
    conf.brokenTexts.map(line => {
      //如果有子组件才计算，因为换行之后只有一个最高行高，没有子组件的
      if (line.children.length) {
        line.maxLineHeight = Math.max(...line.children.map(v => v.lineHeight))
      }
    })
    if (textMode !== TextMode.FIXED) {
      conf.layout.h = getLineY(conf.brokenTexts.length)
      conf.center = {
        x: x + conf.layout.w / 2,
        y: y + conf.layout.h / 2
      }
    }
    // console.log('conf.brokenTexts', conf.brokenTexts)
    // console.log('conf', conf)
    // setTextarea()
  }

  useMount(() => {
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
        render(ctx)
      })
    }
  })

  useEffect(() => {
    if (textareaRef.current) {
      setTextarea()
    }
  }, [textareaRef.current])

  useEffect(() => {
    setPosition({lineIndex: 0, xIndex: 0})
  }, [])

  function setTextarea() {
    let texts = conf.brokenTexts.map(line => {
      return line.children.map(t => t.text).join('')
    }).join('\n')
    // console.log('texts',texts)
    textareaRef.current!.value = texts
  }


  function checkLine(line: any[]) {
    if (line.length) {
      line.pop()
    } else {
      if (conf.brokenTexts.length > 1) {
        conf.brokenTexts.pop()
        checkLine(conf.brokenTexts[conf.brokenTexts.length - 1].children)
      }
    }
  }

  function onTextKeyDown(e?: KeyboardEvent, keyCode?: number) {
    let keys = [38, 40, 37, 39, 8, 13]
    let code = keyCode ?? e?.keyCode ?? 0
    if (keys.includes(code)) {
      const {brokenTexts} = conf
      let newLineIndex = position.lineIndex
      let newXIndex = position.xIndex
      switch (code) {
        //上
        case 38:
          if (newLineIndex === 0) return
          newLineIndex--
          break
        //下
        case 40:
          if (newLineIndex === conf.brokenTexts.length - 1) return
          newLineIndex++
          break
        //左
        case 37:
          if (newXIndex === 0) {
            if (newLineIndex === 0) return
            newLineIndex--
            newXIndex = brokenTexts[newLineIndex].children.length - 1
          } else {
            newXIndex--
          }
          break
        //右
        case 39:
          if (newXIndex === brokenTexts[newLineIndex].children.length) {
            newLineIndex++
            newXIndex = 0
          } else {
            newXIndex++
          }
          break
        //删除
        case 8:
          checkLine(conf.brokenTexts[conf.brokenTexts.length - 1].children)
          calcConf()
          render(ctx)
          break
        //回车
        case 13:
          conf.brokenTexts.push({
            maxLineHeight: currentTextInfo.lineHeight,
            newLine: true,
            children: []
          })
          newLineIndex++
          newXIndex = 1
          calcConf()
          render(ctx)
          break
      }
      if (newLineIndex > conf.brokenTexts.length - 1) {
        newLineIndex = conf.brokenTexts.length - 1
      }
      if (newXIndex > brokenTexts[newLineIndex].children.length) {
        newXIndex = brokenTexts[newLineIndex].children.length
      }
      cursor.current.style.top = getLineY(newLineIndex) + 'px'
      let left = 0
      //因为textline可以为空数组，newXIndex取不到值
      if (newXIndex) {
        if (newXIndex === brokenTexts[newLineIndex].children.length) {
          let last = brokenTexts[newLineIndex].children[newXIndex - 1]
          left = last.x + last.width
        } else {
          left = brokenTexts[newLineIndex].children[newXIndex].x
        }
      }
      cursor.current.style.left = left + 'px'
      console.log('newXIndex', newXIndex, left)
      setPosition({lineIndex: newLineIndex, xIndex: newXIndex})
    }
  }

  //调整行内的文字，当自动高度时
  function adjustLineTextOnAutoH(line: TextLine, rectW: number): Text[] {
    let index = -1
    for (let i = 0; i < line.children.length; i++) {
      let text = line.children[i]
      let textW = text.x + text.width
      if (textW > rectW) {
        index = i
        break
      }
    }
    if (index !== -1) {
      let more = line.children.splice(index)
      let first = clone(more[0])
      more.map(text => {
        text.x = text.x - first.x
      })
      return more
    }
    return []
  }

  function onChange(e: any) {
    const {textMode, brokenTexts, center} = conf

    let val = e.nativeEvent.data
    //删除和回车都是等于null
    if (val === null) return
    ctx.save()
    let {fontWeight, fontSize, lineHeight, fontFamily} = currentTextInfo
    ctx.font = `${fontWeight} ${fontSize}px/${lineHeight}px ${fontFamily}`
    let b = ctx.measureText(val)
    let newText = clone(currentTextInfo) as Text
    newText.text = val
    newText.width = b.width
    if (brokenTexts.length) {
      let lastRow = brokenTexts[brokenTexts.length - 1]
      if (lastRow.children.length) {
        let last = lastRow.children[lastRow.children.length - 1]
        newText.x = last.x + last.width
      } else {
        newText.x = 0
      }
      lastRow.children.push(newText)
    } else {
      newText.x = 0
      brokenTexts.push({
        maxLineHeight: newText.lineHeight,
        newLine: true,
        children: [newText]
      })
    }

    ctx.restore()
    onTextKeyDown(undefined, 39)
    calcConf()
    render(ctx)
  }


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
    // console.log('e', cx, ex)
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
          let abs = Math.abs(item.x - ex)
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
    setTimeout(() => {
      textareaRef.current?.focus()
    })
    let position = getPosition(e)
    if (position) {
      let {lineIndex, xIndex} = position
      let {layout: {x, y, w, h}, textAlign, textLineHeight, center, brokenTexts} = conf
      isEnter.current = true
      cursor.current.style.top = getLineY(lineIndex) + 'px'
      let left = brokenTexts[lineIndex].children[xIndex].x
      // left += center.x
      cursor.current.style.left = left + 'px'
      setPosition({lineIndex, xIndex})
      conf.lan = []
      render(ctx)
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
        // left += center.x
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
        render(ctx)
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
    }
    calcConf()
    f()
  }

  function f() {
    render(ctx)
  }

  function onCanvasKeyDown(e: KeyboardEvent) {
  }

  function getConfig2() {
    console.log(conf.brokenTexts)
  }

  return (
    <div className={'docs'}>
      <div className="toolbar">
        <button onClick={getConfig2}>所有配置</button>
        <button onClick={getConfig}>配置</button>
        <button onClick={changeSize}>变大</button>
      </div>
      <div className={'canvasWrapper'}>
        <div className="canvas-body">
          <canvas
            tabIndex={1}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onKeyDown={onCanvasKeyDown}
            ref={ref}/>
          <div className={'cursor'} ref={cursor}></div>
          <textarea
            ref={textareaRef}
            onKeyDown={onTextKeyDown}
            onChange={onChange}></textarea>
        </div>
      </div>
    </div>
  )
}

export default App
