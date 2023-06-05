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
  end?: boolean,//标记选中的起终点。因为字体变大之后会换到第二行。需要重新设置SelectInfo
  start?: boolean,
  width: number,
  x: number,
} & TextInfo
type TextLine = {
  maxLineHeight: number,
  newLine: boolean,
  children: Text[]
}

let brokenTexts: TextLine[] = []
brokenTexts = [
  {
    "maxLineHeight": 28.5,
    "newLine": true,
    "children": [
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "q",
        "width": 12.79296875,
        "x": 0
      },
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "w",
        "width": 15.791015625,
        "x": 12.79296875
      },
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "e",
        "width": 11.34765625,
        "x": 28.583984375
      },
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "r",
        "width": 7.63671875,
        "x": 39.931640625
      },
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "t",
        "width": 7.451171875,
        "x": 47.568359375
      },
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "y",
        "width": 10.5859375,
        "x": 55.01953125
      },
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "u",
        "width": 12.32421875,
        "x": 65.60546875
      },
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "i",
        "width": 5.322265625,
        "x": 77.9296875
      },
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "o",
        "width": 12.71484375,
        "x": 83.251953125
      }
    ]
  },
  {
    "maxLineHeight": 28.5,
    "newLine": false,
    "children": [
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "p",
        "width": 12.7734375,
        "x": 0
      },
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "a",
        "width": 11.0546875,
        "x": 12.7734375
      },
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "s",
        "width": 9.2578125,
        "x": 23.828125
      },
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "我",
        "width": 20,
        "x": 33.0859375
      },
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "要",
        "width": 20,
        "x": 53.0859375
      },
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "d",
        "width": 12.79296875,
        "x": 73.0859375
      },
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "f",
        "width": 6.93359375,
        "x": 85.87890625
      }
    ]
  },
  {
    "maxLineHeight": 28.5,
    "newLine": false,
    "children": [
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "g",
        "width": 12.79296875,
        "x": 0
      },
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "h",
        "width": 12.314453125,
        "x": 12.79296875
      },
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "j",
        "width": 5.341796875,
        "x": 25.107421875
      },
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "k",
        "width": 10.888671875,
        "x": 30.44921875
      },
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "l",
        "width": 5.322265625,
        "x": 41.337890625
      },
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "z",
        "width": 9.833984375,
        "x": 46.66015625
      },
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "x",
        "width": 10.13671875,
        "x": 56.494140625
      },
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "c",
        "width": 10.029296875,
        "x": 66.630859375
      },
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "v",
        "width": 10.498046875,
        "x": 76.66015625
      },
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "b",
        "width": 12.7734375,
        "x": 87.158203125
      }
    ]
  },
  {
    "maxLineHeight": 28.5,
    "newLine": false,
    "children": [
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "n",
        "width": 12.32421875,
        "x": 0
      },
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "m",
        "width": 18.740234375,
        "x": 12.32421875
      }
    ]
  }
]
brokenTexts = [
  {
    "maxLineHeight": 28.5,
    "newLine": true,
    "children": [
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "q",
        "width": 12.79296875,
        "x": 0
      },
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "w",
        "width": 15.791015625,
        "x": 12.79296875
      },
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "e",
        "width": 11.34765625,
        "x": 28.583984375
      },
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "r",
        "width": 7.63671875,
        "x": 39.931640625
      },
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "t",
        "width": 7.451171875,
        "x": 47.568359375
      },
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "y",
        "width": 10.5859375,
        "x": 55.01953125
      },
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "u",
        "width": 12.32421875,
        "x": 65.60546875
      },
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "i",
        "width": 5.322265625,
        "x": 77.9296875
      },
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "o",
        "width": 12.71484375,
        "x": 83.251953125
      }
    ]
  },
  {
    "maxLineHeight": 78,
    "newLine": false,
    "children": [
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "p",
        "width": 12.7734375,
        "x": 0
      },
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "a",
        "width": 11.0546875,
        "x": 12.7734375
      },
      {
        "fontSize": 55,
        "lineHeight": 78,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "s",
        "width": 25.458984375,
        "x": 23.828125,
        "start": false
      }
    ]
  },
  {
    "maxLineHeight": 78,
    "newLine": false,
    "children": [
      {
        "fontSize": 55,
        "lineHeight": 78,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "我",
        "width": 55,
        "x": 0
      }
    ]
  },
  {
    "maxLineHeight": 78,
    "newLine": false,
    "children": [
      {
        "fontSize": 55,
        "lineHeight": 78,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "要",
        "width": 55,
        "x": 0
      },
      {
        "fontSize": 55,
        "lineHeight": 78,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "d",
        "width": 35.1806640625,
        "x": 55
      },
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "f",
        "width": 6.93359375,
        "x": 90.1806640625,
        "end": false
      }
    ]
  },
  {
    "maxLineHeight": 28.5,
    "newLine": false,
    "children": [
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "g",
        "width": 12.79296875,
        "x": 0
      },
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "h",
        "width": 12.314453125,
        "x": 12.79296875
      },
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "j",
        "width": 5.341796875,
        "x": 25.107421875
      },
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "k",
        "width": 10.888671875,
        "x": 30.44921875
      },
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "l",
        "width": 5.322265625,
        "x": 41.337890625
      },
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "z",
        "width": 9.833984375,
        "x": 46.66015625
      },
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "x",
        "width": 10.13671875,
        "x": 56.494140625
      },
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "c",
        "width": 10.029296875,
        "x": 66.630859375
      },
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "v",
        "width": 10.498046875,
        "x": 76.66015625
      },
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "b",
        "width": 12.7734375,
        "x": 87.158203125
      }
    ]
  },
  {
    "maxLineHeight": 28.5,
    "newLine": false,
    "children": [
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "n",
        "width": 12.32421875,
        "x": 0
      },
      {
        "fontSize": 20,
        "lineHeight": 28.5,
        "fontWeight": "500",
        "fontFamily": "sans-serif",
        "text": "m",
        "width": 18.740234375,
        "x": 12.32421875
      }
    ]
  }
]

type Conf = {
  texts: any[],
  brokenTexts: TextLine[],
  select: Rect[],
  textAlign: TextAlign,
  textMode: TextMode,
  textLineHeight: number,
  layout: Rect,
  center: P,
}
let conf: Conf = {
  texts: [],
  brokenTexts,
  select: [],
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

let currentTextInfo: TextInfo = {
  fontSize: 20,
  lineHeight: 28.5,
  fontWeight: '500',
  fontFamily: 'sans-serif'
}

function clone<T>(val: T): T {
  return JSON.parse(JSON.stringify(val))
}

let chinese = {
  is: false,
  texts: ''
}
let isEnter: boolean = false

type SelectInfo = {
  lineIndex: number,
  xIndex: number
}

type MousePointLocation = {
  lineIndex: number,
  xIndex: number,
}

let location = {
  start: {
    lineIndex: 0,
    xIndex: 0,
  },
  end: {
    lineIndex: 0,
    xIndex: 0,
  }
}

function App() {
  const ref = useRef(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>(null as any)
  const [canvasRect, setCanvasRect] = useState<DOMRect>(null as any)
  const cursor = useRef<HTMLDivElement>(null as any)

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
    location = {
      start: {lineIndex: 0, xIndex: 0},
      end: {lineIndex: 0, xIndex: 0}
    }
  }, [])

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

  //计算一行的X坐标
  function calcLineX(line: TextLine) {
    ctx.save()
    let rowX = 0
    line?.children?.map((obj: Text) => {
      let width = 0
      if (obj.width) {
        let {fontWeight, fontSize, lineHeight, fontFamily} = obj
        ctx.font = `${fontWeight} ${fontSize}px/${lineHeight}px ${fontFamily}`
        width = ctx.measureText(obj.text).width
      } else {
        width = obj.width
      }
      obj.x = rowX
      obj.width = width
      rowX += width
    })
    ctx.restore()
  }

  function render(ctx: CanvasRenderingContext2D) {
    // console.log('render', conf.brokenTexts)
    let {layout: {x, y, w, h,}, center, select} = conf
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
    select.map((value) => {
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
    // original = JSON.parse(JSON.stringify(conf))
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
        // 如果下一行是新行，那不应把多余的加到新行里面。如果没有多余的行，那么不需要合并
        if (!r.newLine && currentIndex !== previousValue.length) {
          let preLineMoreTexts = previousValue.pop()!.children
          let last = preLineMoreTexts[preLineMoreTexts.length - 1]
          r.children.map(text => {
            text.x = text.x + last.x + last.width
          })
          r.children = preLineMoreTexts.concat(r.children)
        }
        let more = adjustLineTextOnAutoH(r.children, w)
        previousValue.push(r)
        if (more.length) {
          more.map(line2 => {
            previousValue.push({
              maxLineHeight: -1,
              newLine: false,
              children: line2
            })
          })
        }
        return previousValue
      }, temp)
      conf.brokenTexts = temp
    }
    conf.brokenTexts.map((line) => {
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

  function setTextarea() {
    let texts = conf.brokenTexts.map(line => {
      return line.children.map(t => t.text).join('')
    }).join('\n')
    // console.log('texts',texts)
    textareaRef.current!.value = texts
  }

  //合并不是没换行的行
  function mergeLine(index: number) {
    let currentLine = conf.brokenTexts[index]
    //如果是最后一行就没必要往下执行了
    if (index !== conf.brokenTexts.length - 1) {
      let delCount = Infinity
      conf.brokenTexts.slice(index + 1).map((line, j) => {
        if (delCount !== Infinity) return
        if (line.newLine) {
          delCount = j
        } else {
          currentLine.children = currentLine.children.concat(line.children)
        }
      })
      conf.brokenTexts.splice(index + 1, delCount)
    }
    calcLineX(currentLine)
  }

  function checkLocation({lineIndex, xIndex}: SelectInfo) {
    const {brokenTexts} = conf
    let newLineIndex = lineIndex
    let newXIndex = xIndex

    if (newLineIndex < 0) newLineIndex = 0
    if (newLineIndex > brokenTexts.length - 1) {
      newLineIndex = brokenTexts.length - 1
    }
    if (newXIndex < 0) newXIndex = 0
    if (newXIndex > brokenTexts[newLineIndex]?.children.length) {
      newXIndex = brokenTexts[newLineIndex].children.length
    }

    //如果不是新行，不能选中第一格
    if (!brokenTexts[newLineIndex].newLine) {
      if (newXIndex === 0) newXIndex = 1
    }
    console.log('newXIndex', newLineIndex, newXIndex)
    location.start = {lineIndex: newLineIndex, xIndex: newXIndex}
    drawCursor(location.start)
  }

  function drawCursor(location: MousePointLocation) {
    let {lineIndex, xIndex} = location
    let left = 0
    //因为textLine可以为空数组，newXIndex取不到值
    if (xIndex) {
      if (xIndex === conf.brokenTexts[lineIndex].children.length) {
        let last = conf.brokenTexts[lineIndex].children[xIndex - 1]
        left = last.x + last.width
      } else {
        left = conf.brokenTexts[lineIndex].children[xIndex].x
      }
    }
    cursor.current.style.top = getLineY(lineIndex) + 'px'
    cursor.current.style.left = left + 'px'
  }

  function getLineX(xIndex: number, line: TextLine) {
    let left = 0
    if (xIndex === line.children.length) {
      let last = line.children[xIndex - 1]
      left = last.x + last.width
    } else {
      left = line.children[xIndex].x
    }
    return left
  }

  //因为选中的XIndex一般是在文字的后面。所以设置end为true的那个文字是下一个文字
  //所以如果选中最后一个的话，那个设置end的文字就应该是下一行的第0个
  //最后一行的最后一个是返回true
  function getNextText(lineIndex: number, xIndex: number): boolean | Text {
    let line = conf.brokenTexts[lineIndex]
    if (line.children) {
      if (xIndex === line.children.length) {
        //最后一行的最后一个
        if (lineIndex === conf.brokenTexts.length - 1) {
          return true
        }
        if (conf.brokenTexts?.[lineIndex + 1]?.children) {
          return conf.brokenTexts[lineIndex + 1].children[0]
        }
      } else {
        return line.children[xIndex]
      }
    }
    return false
  }

  //调整行内的文字，当自动高度时
  function adjustLineTextOnAutoH(line: Text[], rectW: number): Text[][] {
    let index = -1
    for (let i = 0; i < line.length; i++) {
      let text = line[i]
      let textW = text.x + text.width
      if (textW > rectW) {
        index = i
        break
      }
    }
    if (index !== -1) {
      let more = line.splice(index)
      let first = clone(more[0])
      more.map(text => {
        text.x = text.x - first.x
      })
      return [more].concat(adjustLineTextOnAutoH(more, rectW))
    }
    return []
  }

  function onTextKeyDown(e?: KeyboardEvent, keyCode?: number) {
    // console.log(e?.keyCode)
    let keys = [38, 40, 37, 39, 8, 13, 35, 36, 46]
    let code = keyCode ?? e?.keyCode ?? 0
    if (keys.includes(code)) {
      const {brokenTexts} = conf
      let newLineIndex = location.start.lineIndex
      let newXIndex = location.start.xIndex
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
          if (newLineIndex === 0) {
            newXIndex--
          } else {
            //如果是新行，则可以移动到0。否则到1就要移向上一行
            if (newXIndex === (brokenTexts[newLineIndex].newLine ? 0 : 1)) {
              newLineIndex--
              newXIndex = brokenTexts[newLineIndex].children.length
            } else {
              newXIndex--
            }
          }
          break
        //右
        case 39:
          if (newLineIndex === brokenTexts.length - 1) {
            newXIndex++
          } else {
            if (newXIndex === brokenTexts[newLineIndex].children.length) {
              newLineIndex++
              newXIndex = 0
            } else {
              newXIndex++
            }
          }
          break
        //backspace删除
        case 8:
        //delete删除
        case 46:
          if (location.end.lineIndex === -1) {
            let currentLine = brokenTexts[newLineIndex]
            let mergeLineIndex = newLineIndex

            if (code === 8) {
              if (newLineIndex === 0 && newXIndex === 0) return
              if (currentLine.children.length) {
                if (newXIndex === (currentLine.newLine ? 0 : 1)) {
                  if (!currentLine.newLine) {
                    currentLine.children.splice(newXIndex - 1, 1)
                  }
                  currentLine.newLine = false
                  newLineIndex--
                  newXIndex = brokenTexts[newLineIndex].children.length
                  mergeLineIndex = newLineIndex
                } else {
                  currentLine.children.splice(newXIndex - 1, 1)
                  newXIndex--
                }
              } else {
                brokenTexts.splice(newLineIndex, 1)
                newLineIndex--
                newXIndex = brokenTexts[newLineIndex].children.length
              }
            } else {
              if (newXIndex === currentLine.children.length) {
                //如果在最后一行不管
                if (newLineIndex === brokenTexts.length - 1) {
                  return
                } else {
                  let nextLine = brokenTexts[newLineIndex + 1]
                  if (nextLine.newLine) {
                    //新行，只需要改为非新行，不用删除数据
                    if (nextLine.children.length) {
                      nextLine.newLine = false
                    } else {
                      brokenTexts.splice(newLineIndex + 1, 1)
                    }
                  } else {
                    brokenTexts.splice(newLineIndex + 1, 1)
                  }
                }
              } else {
                currentLine.children.splice(newXIndex, 1)
              }
            }
            mergeLine(mergeLineIndex)
          } else {
            delSelectLines()
            newLineIndex = location.start.lineIndex
            newXIndex = location.start.xIndex
          }
          calcConf()
          render(ctx)
          break
        //回车
        case 13:
          delSelectLines()
          newLineIndex = location.start.lineIndex
          newXIndex = location.start.xIndex

          let data = {
            maxLineHeight: currentTextInfo.lineHeight,
            newLine: true,
            children: brokenTexts[newLineIndex]?.children?.slice(newXIndex) ?? []
          }
          calcLineX(data)
          if (brokenTexts.length) {
            conf.brokenTexts[newLineIndex]?.children.splice(newXIndex, Infinity)
            conf.brokenTexts.splice(newLineIndex + 1, 0, data)
          } else {
            conf.brokenTexts.push(data)
          }
          newLineIndex++
          newXIndex = 0
          mergeLine(newLineIndex)
          calcConf()
          render(ctx)
          break
        //end
        case 35:
          newXIndex = brokenTexts[newLineIndex].children.length
          break
        //home
        case 36:
          newXIndex = 0
          break
      }
      checkLocation({lineIndex: newLineIndex, xIndex: newXIndex})
    }
  }

  function onChange(e: any) {
    let val = e.nativeEvent.data
    if (chinese.is) {
      conf = clone(original)
    }
    const {textMode, brokenTexts, center} = conf

    //删除和回车都是等于null
    if (val === null) return
    ctx.save()
    let {fontWeight, fontSize, lineHeight, fontFamily} = currentTextInfo
    ctx.font = `${fontWeight} ${fontSize}px/${lineHeight}px ${fontFamily}`
    let vars: string[] = val.split('')
    let texts: Text[] = vars.map(s => {
      let b = ctx.measureText(s)
      let newText = clone(currentTextInfo) as Text
      newText.text = s
      newText.width = b.width
      return newText
    })
    if (brokenTexts.length) {
      delSelectLines()
      let {lineIndex, xIndex} = location.start
      let currentLine = brokenTexts[lineIndex]

      if (currentLine.children.length) {
        if (xIndex === currentLine.children.length) {
          currentLine.children = currentLine.children.concat(texts)
        } else {
          currentLine.children.splice(xIndex, 0, ...texts)
        }
      } else {
        currentLine.children = texts
      }
      calcLineX(currentLine)
    } else {
      brokenTexts.push({
        maxLineHeight: texts[0].lineHeight,
        newLine: true,
        children: texts
      })
      calcLineX(brokenTexts[0])
    }

    ctx.restore()
    calcConf()
    if (!chinese.is) {
      onTextKeyDown(undefined, 39)
    } else {
      chinese.texts = val
    }
    render(ctx)
  }

  //删除选中区域
  function delSelectLines() {
    let end = location.end
    let newLineIndex = end.lineIndex
    if (newLineIndex === -1) return

    const {brokenTexts,} = conf
    let start = location.start
    let {lineIndex, xIndex} = location.start
    let currentLine = brokenTexts[lineIndex]
    let minXIndex = Math.min(end.xIndex, xIndex)
    let maxXIndex = Math.max(end.xIndex, xIndex)

    if (lineIndex === end.lineIndex) {
      currentLine.children.splice(minXIndex, maxXIndex - minXIndex)
      //把光标设置最小的那个，因为start.xIndex不一定是在前面。如果从后往前复制的话
      location.start.xIndex = minXIndex
    } else {
      //判断起点与终点大小，确定最终的起点终点
      if (newLineIndex < lineIndex) {
        start = location.end
        end = location.start
      }
      let startLine = conf.brokenTexts[start.lineIndex]
      let endLine = conf.brokenTexts[end.lineIndex]

      startLine.children.splice(start.xIndex, Infinity)
      endLine.children.splice(0, end.xIndex)
      //把最后一行设为非新行，因为要与第一行合并
      endLine.newLine = false

      for (let i = start.lineIndex + 1; i < end.lineIndex; i++) {
        conf.brokenTexts.splice(i, 1)
      }

      location.start = start
    }

    mergeLine(location.start.lineIndex)

    conf.select = []
    location.end = {lineIndex: -1, xIndex: -1}
  }

  //设置选中区域
  function setSelectLines() {
    let {lineIndex, xIndex} = location.start

    let newLineIndex = location.end.lineIndex
    let newXIndex = location.end.xIndex
    let minXIndex = Math.min(newXIndex, xIndex)
    let maxXIndex = Math.max(newXIndex, xIndex)
    let minLineIndex = Math.min(newLineIndex, lineIndex)
    let maxLineIndex = Math.max(newLineIndex, lineIndex)

    drawCursor(location.end)

    let select = []
    if (newLineIndex === lineIndex) {
      let line = conf.brokenTexts[lineIndex]
      let leftX = getLineX(minXIndex, line)
      let rightX = getLineX(maxXIndex, line)

      let rect = {
        x: leftX,
        y: getLineY(lineIndex, false),
        w: Math.abs(rightX - leftX),
        h: line.maxLineHeight
      }
      select = [rect]
    } else {
      let start = location.start
      let end = location.end

      if (newLineIndex < lineIndex) {
        start = location.end
        end = location.start
      }
      let startLine = conf.brokenTexts[start.lineIndex]
      let startLineLast = startLine.children[startLine.children.length - 1];
      let leftX = getLineX(start.xIndex, startLine)
      // console.log('start', start)
      // console.log('startLineLast', startLineLast)
      let startRect = {
        x: leftX,
        y: getLineY(start.lineIndex, false),
        w: Math.abs(startLineLast.x + startLineLast.width - leftX),
        h: startLine.maxLineHeight
      }

      let endLine = conf.brokenTexts[end.lineIndex]
      let endLineFirst = endLine.children[0]
      let rightX = getLineX(end.xIndex, endLine)
      let endRect = {
        x: endLineFirst.x,
        y: getLineY(end.lineIndex, false),
        w: Math.abs(rightX - endLineFirst.x),
        h: endLine.maxLineHeight
      }

      select = [startRect, endRect]
      for (let i = minLineIndex + 1; i < maxLineIndex; i++) {
        let row = conf.brokenTexts[i]
        select.push({
          x: row.children[0].x,
          y: getLineY(i, false),
          w: Math.abs(row.children[row.children.length - 1].x + row.children[row.children.length - 1].width - row.children[0].x),
          h: row.maxLineHeight
        })
      }
    }

    // console.log('select', JSON.stringify(select, null, 2))
    conf.select = select
  }

  function onCompositionStart() {
    console.log('onCompositionStart')
    chinese.is = true
    original = clone(conf)
  }

  function onCompositionEnd() {
    console.log('onCompositionEnd', chinese.texts)
    chinese.is = false
    chinese.texts.split('').map(() => {
      onTextKeyDown(undefined, 39)
    })
  }

  function getLineY(i: number, isCursor: boolean = true) {
    let {layout: {h}, brokenTexts} = conf
    let lY = isCursor ? 0 : -h / 2
    // console.log('brokenTexts.slice(i)',brokenTexts.slice(0,i))
    brokenTexts.slice(0, i).map(line => lY = lY + line.maxLineHeight)
    return lY
  }

  function getMousePointLocation(e: MouseEvent): MousePointLocation {
    let ex = e.clientX - canvasRect.left;
    let ey = e.clientY - canvasRect.top;
    let {layout: {x, y, w, h}, center, brokenTexts} = conf
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
          let w2 = item.width / 2
          let abs = item.x + w2 - ex
          // console.log('item.x', item.x)
          // console.log('cx', cx)
          // console.log('ex', ex)
          // console.log('abs', abs)
          // console.log('w2', w2)
          if (Math.abs(abs) < w2) {
            if (abs < 0) {
              xIndex = j + 1
              lineIndex = i
              isBreak = true
              break
            }
            if (abs > 0) {
              xIndex = j
              lineIndex = i
              isBreak = true
              break
            }
          }
        }
        if (isBreak) break
        else {
          lineIndex = i
          xIndex = line.children.length
          break
        }
      }
    }

    if (lineIndex !== undefined && xIndex !== undefined) {
      // console.log('{lineIndex, xIndex}', {lineIndex, xIndex})
      return {lineIndex, xIndex}
    }
    return null as any
  }

  function onMouseDown(e: MouseEvent) {
    console.log('onMouseDown')
    setTimeout(() => {
      textareaRef.current?.focus()
    })
    let l = getMousePointLocation(e)
    if (l) {
      isEnter = true
      checkLocation(l)
      location.start = l
      location.end = {lineIndex: -1, xIndex: -1}
      conf.select = []
      render(ctx)
      // console.log('lineIndex', lineIndex, 'xIndex', xIndex)
    }
  }

  function onMouseMove(e: MouseEvent) {
    // console.log('onMouseMove',isEnter)
    if (isEnter) {
      let newLocation = getMousePointLocation(e)
      if (newLocation) {
        location.end = newLocation
        setSelectLines()
        f()
      }
      // console.log('e', ex, ey)
    }
  }

  function onMouseUp() {
    console.log('onMouseUp')
    isEnter = false
  }

  function getConfig() {
    console.log(conf.brokenTexts)
    navigator.clipboard.writeText(JSON.stringify(conf.brokenTexts, null, 2))
      .then(() => {
        message.success('复制成功')
      })
  }

  function changeSize() {
    let {lineIndex, xIndex} = location.start
    let newLineIndex = location.end.lineIndex
    let start = location.start
    let end = location.end
    //特殊标记，如果选中的是最后一行的最后一个，没有下一个文字了，end的标记就会失效
    let isLineEnd = false

    if (newLineIndex === lineIndex) {
      let minXIndex = Math.min(end.xIndex, xIndex)
      let maxXIndex = Math.max(end.xIndex, xIndex)
      let currentLine = conf.brokenTexts[lineIndex]
      currentLine.children.slice(minXIndex, maxXIndex).map(value => {
        value.fontSize += 10
        value.lineHeight = Math.trunc(value.fontSize / 0.7)
      })
      //起点不存在这个问题，因为这个if判断的是在同一行内。起点在最后一个时，走不这个if里面
      currentLine.children[minXIndex].start = true
      let next = getNextText(lineIndex, maxXIndex)
      if (typeof next === 'object') next.end = true
      else isLineEnd = next

      calcLineX(currentLine)
    } else {
      if (newLineIndex < lineIndex) {
        start = location.end
        end = location.start
      }

      for (let i = start.lineIndex; i <= end.lineIndex; i++) {
        let line = conf.brokenTexts[i]
        let startIndex = 0
        let endIndex = line.children.length

        if (i === start.lineIndex) {
          startIndex = start.xIndex
          let next = getNextText(i, startIndex)
          if (typeof next === 'object') next.start = true
        }
        if (i === end.lineIndex) {
          endIndex = end.xIndex
          let next = getNextText(i, endIndex)
          if (typeof next === 'object') next.end = true
          else isLineEnd = next
        }

        console.log(startIndex, endIndex)
        line.children.slice(startIndex, endIndex).map(value => {
          value.fontSize += 10
          value.lineHeight = Math.trunc(value.fontSize / 0.7)
        })
        calcLineX(line)
      }
    }
    calcConf()

    conf.brokenTexts.map((line, index) => {
      if (line.children.length) {
        let rIndex = line.children.findIndex(t => t.start)
        if (rIndex > -1) {
          line.children[rIndex].start = false
          location.start = {lineIndex: index, xIndex: rIndex}
        }
        rIndex = line.children.findIndex(t => t.end)
        if (rIndex > -1) {
          line.children[rIndex].end = false
          location.end = {lineIndex: index, xIndex: rIndex}
        }
      }
    })
    if (isLineEnd) {
      let lastLine = conf.brokenTexts[conf.brokenTexts.length - 1]
      location.end = {
        lineIndex: conf.brokenTexts.length - 1,
        xIndex: lastLine.children.length
      }
    }
    setSelectLines()
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
            onCompositionStart={onCompositionStart}
            onCompositionEnd={onCompositionEnd}
            onKeyDown={onTextKeyDown}
            onChange={onChange}/>
        </div>
      </div>
    </div>
  )
}

export default App
