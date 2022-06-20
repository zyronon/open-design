import * as React from 'react'
import {MouseEvent, Ref, useEffect, useRef, useState} from "react";
import './index.scss'
import _, {clone} from 'lodash'
import {getAngle, getHypotenuse, getRoundOtherPoint} from "../../utils";

enum BlockType {
  LINE = 0,
  FILL = 1,
  WRAPPER = 2,
  SELECT = 3
}

interface Box {
  id?: number,
  x: number,
  y: number,
  w: number,
  h: number,
  rotate: number,
  lineWidth: number,
  type: BlockType,
  color: string,
  leftX?: number,
  leftY?: number,
  rightX?: number,
  rightY?: number,
  children: Box[]
}

export default function Canvas() {
  let canvasRef: any = useRef()
  let body: any = document.querySelector("body")

  let one = {
    x: 350,
    y: 150,
    w: 50,
    h: 150
  }
  let oldOne = _.clone(one)

  let s = {
    startX: one.x,
    endX: one.x + one.w,
    startY: one.y,
    endY: one.y + one.h,
  }
  let d = 2

  let hover = {}
  let active = {
    startX: one.x - d,
    endX: one.x - d + one.w + 2 * d,
    startY: one.y - d,
    endY: one.y - d + one.h + 2 * d,
  }

  const [canvas, setCanvas] = useState<HTMLCanvasElement>(null!)
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>(null!)
  const [blocks, setBlocks] = useState<Box[]>([])
  const [canvasRect, setCanvasRect] = useState<DOMRect>(null!)


//获取圆上的另一个点
  function getRoundOtherPoint2(p1: any, c: any, angle: number) {
    let {x, y} = p1
    let {cx, cy} = c
    let hypotenuse = getHypotenuse([cx, cy], [x, y])
    // console.log('hypotenuse', hypotenuse)
    let s = Math.abs(y) / Math.abs(hypotenuse)
    // console.log(s)
    let a = Math.acos(s)
    // console.log(a)
    let b = hudu2juedu(a) + angle
    // console.log(b)
    let x1 = Math.sin(jiaodu2hudu(b)) * Math.abs(hypotenuse)
    let y1 = Math.cos(jiaodu2hudu(b)) * Math.abs(hypotenuse)
    return [x1, y1]
  }

  function rotate2(p1: any, c: any, angle: number) {
    let {x, y} = p1
    let {cx, cy} = c
    let radians = (Math.PI / 180) * angle,
      cos = Math.cos(radians),
      sin = Math.sin(radians),
      nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
      ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return [nx, ny];
  }

  function rotate33(p1: any, c: any, angle: number) {
    let {x, y} = p1
    let {cx, cy} = c
    let radians = (Math.PI / 180) * angle,
      cos = Math.cos(radians),
      sin = Math.sin(radians),
      nx = (cos * (x - cx)) - (sin * (y - cy)) + cx,
      ny = (cos * (y - cy)) + (sin * (x - cx)) + cy;
    return [nx, ny];
  }

  useEffect(() => {
    let c = {cx: 0, cy: 0}
    // c = {cx: 175, cy: 225}
    // let p1 = {x: 150, y: 150}
    // console.log(getRoundOtherPoint2(p1, c, -90))
    // console.log(rotate2(p1, c, -90))

    let canvas = canvasRef.current
    setCanvas(canvas)
    // @ts-ignore
    let ctx = canvas.getContext('2d')
    setCtx(ctx)
    let width = canvas.width, height = canvas.height;
    if (window.devicePixelRatio) {
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      canvas.height = height * window.devicePixelRatio;
      canvas.width = width * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    // canvas.style.width = width + "px";
    // canvas.style.height = height + "px";
    // canvas.height = height * 2;
    // canvas.width = width * 2;
    // ctx.scale(2, 2);


    setCanvasRect(canvas.getBoundingClientRect())
    let allLine = {
      x: 0,
      y: 0,
      w: canvas.width,
      h: canvas.height,
      rotate: 0,
      lineWidth: 1,
      type: BlockType.LINE,
      color: 'black',
      children: []
    }
    let oneBox = {
      x: 350,
      y: 150,
      w: 50,
      h: 150,
      rotate: 0,
      lineWidth: 2,
      type: BlockType.LINE,
      color: 'gray',
      children: []
    }
    let oneBoxLine = {
      id: Date.now(),
      x: 80,
      y: 20,
      w: 50,
      h: 150,
      rotate: 70,
      lineWidth: 2,
      type: BlockType.LINE,
      color: 'gray',
      children: []
    }
    let towBox = {
      x: 50,
      y: 50,
      w: 150,
      h: 150,
      rotate: 0,
      lineWidth: 1,
      type: BlockType.FILL,
      color: 'gray',
      children: []
    }
    let a = 0
    let threeBox = {
      x: 350 + a,
      y: 50 + a,
      w: 50,
      h: 200,
      rotate: 0,
      lineWidth: 1,
      type: BlockType.FILL,
      color: 'gray',
      children: []
    }
    let selectBox = {
      x: 50,
      y: 50,
      w: 50,
      h: 100,
      rotate: 0,
      lineWidth: 2,
      type: BlockType.SELECT,
      color: 'gray',
      children: []
    }
    setBlocks(o => {
      // o.push(getPath(allLine))
      o.push(getPath(oneBox))
      // o.push(getPath(oneBoxLine))
      // o.push(getPath(selectBox))
      // o.push(getPath(towBox))
      // o.push(getPath(threeBox))
      return clone(o)
    })
  }, [])

  useEffect(() => {
    ctx && draw2()
  }, [blocks])

  function draw2() {
    // ctx.lineWidth = 8
    // let s = 4
    // x = 150.5 * s, y = 150.5 * s, w = 50 * s, h = 50 * s
    // ctx.scale(.25, .25)
    // ctx.rotate(20 * Math.PI / 180)
    // ctx.imageSmoothingEnabled = true;
    // ctx.beginPath()
    // ctx.moveTo(x, y)
    // ctx.lineTo(x + w, y);
    // ctx.lineTo(x + w, y + h);
    // ctx.lineTo(x, y + h);
    // ctx.lineTo(x, y);
    // ctx.closePath()
    // ctx.stroke()
    // ctx.beginPath()
    // ctx.moveTo(15, 20.5)
    // ctx.lineTo(115, 20.5)
    // ctx.stroke()
    clearAll()
    ctx.save()
    // ctx.translate(0.5, 0.5);
    ctx.lineCap = 'square'
    blocks.map(v => {
      // console.log(v)
      render(v)
    })
    ctx.restore()
  }


  function render(black: Box, parent?: Box) {
    ctx.save()
    let {x, y, w, h, color, rotate, lineWidth, type} = black
    if (parent) {
      x = parent.x
      y = parent.y
      w = parent.w
      h = parent.h
      rotate = parent.rotate

      let outside = .5
      x = x - outside
      y = y - outside
      w = w + 2 * outside
      h = h + 2 * outside
    }

    ctx.lineWidth = lineWidth
    if (rotate) {
      let p1 = {x, y}
      let p2 = {x: x + w, y}
      let p3 = {x: x + w, y: y + h}
      let p4 = {x, y: y + h}
      let c = {cx: x + w / 2, cy: y + h / 2}
      ctx.translate(x + w / 2, y + h / 2)
      ctx.rotate(rotate * Math.PI / 180)
      x = -w / 2
      y = -h / 2
      // console.log(rotate2(p1, c, -rotate))
      // console.log(rotate2(p2, c, -rotate))
      // console.log(rotate2(p3, c, -rotate))
      // console.log(rotate2(p4, c, -rotate))
    }
    // ctx.strokeRect(x, y, w, h)
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x, y);
    ctx.closePath()

    switch (type) {
      case BlockType.FILL:
        ctx.fillStyle = color
        ctx.fill()
        break
      case BlockType.LINE:
        ctx.strokeStyle = color
        ctx.stroke()
        break
      case BlockType.WRAPPER:
        ctx.strokeStyle = 'rgb(139,80,255)'
        ctx.stroke()
        break
      case BlockType.SELECT:
        // console.log('select')

        // rotate = parent!.rotate
        // // lineWidth = parent!.lineWidth

        ctx.strokeStyle = 'rgb(139,80,255)'
        ctx.stroke()
        let d = 4
        clear({
          x: x - d,
          y: y - d,
          w: 2 * d,
          h: 2 * d
        })
        clear({
          x: x + w - d,
          y: y - d,
          w: 2 * d,
          h: 2 * d
        })
        clear({
          x: x + w - d,
          y: y + h - d,
          w: 2 * d,
          h: 2 * d
        })
        clear({
          x: x - d,
          y: y + h - d,
          w: 2 * d,
          h: 2 * d
        })

        let r = 3
        let lineWidth = 1.5
        renderRoundRect({
          x: x - d,
          y: y - d,
          w: 2 * d,
          h: 2 * d,
          lineWidth
        }, r)
        renderRoundRect({
          x: x + w - d,
          y: y - d,
          w: 2 * d,
          h: 2 * d,
          lineWidth
        }, r)
        renderRoundRect({
          x: x + w - d,
          y: y + h - d,
          w: 2 * d,
          h: 2 * d,
          lineWidth
        }, r)
        renderRoundRect({
          x: x - d,
          y: y + h - d,
          w: 2 * d,
          h: 2 * d,
          lineWidth
        }, r)
        break
    }

    ctx.restore()
    if (black.children) {
      black.children.map(v => render(v, black))
    }
  }

  //绘制圆角矩形
  function renderRoundRect(rect: any, r: number) {
    ctx.lineWidth = rect.lineWidth
    let {x, y, w, h} = rect
    ctx.beginPath()
    ctx.moveTo(x + w / 2, y)
    ctx.arcTo(x + w, y, x + w, y + h, r)
    ctx.arcTo(x + w, y + h, x, y + h, r)
    ctx.arcTo(x, y + h, x, y, r)
    ctx.arcTo(x, y, x + d, y, r)
    ctx.closePath()
    ctx.stroke()
  }


  function clear(x: number | any, y?: number, w?: number, h?: number) {
    if (typeof x === 'object') {
      ctx.clearRect(x.x, x.y, x.w, x.h)
    } else {
      ctx.clearRect(x, y!, w!, h!)
    }
  }

  function clearAll() {
    clear(0, 0, canvas.width, canvas.height)
  }

  function renderBox2(x: number, y: number, w: number, h: number, color: any) {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x, y);
    ctx.fill()
  }


  function renderLine2(x: number, y: number, w: number, h: number, color: any) {

    ctx.strokeStyle = color
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x, y);
    // ctx.lineTo(x, y - d);
    ctx.stroke()
  }

  let is = false

  function onHover(e: any) {
    let x = e.clientX
    let y = e.clientY
    d = 1.5
    ctx.lineWidth = 2 * d

    if (s.startX < x && x < s.endX && s.startY < y && y < s.endY) {
      if (!is) {
        ctx.strokeStyle = 'rgb(139,80,255)'
        ctx.strokeRect(one.x - d, one.y - d, one.w + 2 * d, one.h + 2 * d)
        is = true
      }
    } else {
      if (is) {
        ctx.strokeStyle = 'white'
        ctx.strokeRect(one.x - d, one.y - d, one.w + 2 * d, one.h + 2 * d)
        is = false
      }
      // ctx.clearRect(one.x - d, one.y - d, one.w + 2 * d, one.h + 2 * d)
    }
  }

  let mouseLeftKeyDown = false

  let startX: any
  let startY: any
  let dd: any

  function onMouseDown(e: any) {
    if (e.which === 1) {
      mouseLeftKeyDown = true
      startX = e.clientX - canvasRect.left
      startY = e.clientY - canvasRect.top
      dd = startX - one.x

      // rotate
      ctx.translate(oldOne.x + oldOne.w / 2, oldOne.y + oldOne.h / 2);


      let [x1, y1] = getX1y1(startX, startY)
      startX = x1
      startY = y1
    }
    console.log('onMouseDown')
  }

  function onMouseUp(e: any) {
    mouseLeftKeyDown = false
    body.style.cursor = "default"
    console.log('onMouseUp')
    // active = {
    //   startX: one.x - d,
    //   endX: one.x - d + one.w + 2 * d,
    //   startY: one.y - d,
    //   endY: one.y - d + one.h + 2 * d,
    // }


    //rotate
    // ctx.translate(-(oldOne.x + oldOne.w / 2), -(oldOne.y + oldOne.h / 2));


    oldOne = _.clone(one)
  }

  let clearStartX = one.x - 2 * d
  let clearEndX = one.w + 4 * d


  function moveStretch2(e: any) {
    let x = e.clientX - canvasRect.left
    let y = e.clientY - canvasRect.top
    let dis = 20
    if (mouseLeftKeyDown) {
      if (x - d - dd - d <= clearStartX) {
        clearStartX = x - d - dd - d
        clearEndX = ((oldOne.w - (x - startX)) + 2 * d) + 2 * d
      }
      if (x - dd - clearStartX >= clearEndX) {
        clearEndX = x - dd - clearStartX
      }

      // console.log(oldOne)
      ctx.lineWidth = 2 * d
      clear(clearStartX, one.y - 2 * d, clearEndX, one.h + 4 * d)
      one.x = x - dd
      // one.y = one.y
      one.w = oldOne.w - (x - startX)
      // one.h = one.h
      renderBox2(one.x, one.y, one.w, one.h, 'black')
      renderLine2(one.x - d, one.y - d, one.w + 2 * d, one.h + 2 * d, 'rgb(139,80,255)')
      return
    }

    if ((active.startX - dis < x && x < active.startX + dis) &&
      (active.startY < y && y < active.endY)
    ) {
      canvas.addEventListener('mousedown', onMouseDown)
      canvas.addEventListener('mouseup', onMouseUp)
      // console.log('1')
      body.style.cursor = "e-resize"
    } else {
      canvas.removeEventListener('mousedown', onMouseDown)
      canvas.removeEventListener('mouseup', onMouseUp)
      mouseLeftKeyDown = false
      // console.log('2')
      body.style.cursor = "default"
    }
  }

  function hudu2juedu(v: number) {
    return v * 180 / Math.PI
  }

  function jiaodu2hudu(v: number) {
    return (v * Math.PI) / 180
  }

  function getX1y1(x: number, y: number) {
    let hypotenuse = getHypotenuse([0, 0], [x, y])
    // console.log('hypotenuse', hypotenuse)
    let s = Math.abs(y) / Math.abs(hypotenuse)
    // console.log(s)
    let a = Math.acos(s)
    // console.log(a)
    let b = hudu2juedu(a) + 20
    // console.log(b)
    let x1 = Math.sin(jiaodu2hudu(b)) * Math.abs(hypotenuse)
    let y1 = Math.cos(jiaodu2hudu(b)) * Math.abs(hypotenuse)
    return [x1, y1]
  }

  function moveStretch(e: any) {
    // console.log(canvasRect)
    // return;
    let x = e.clientX - canvasRect.left
    let y = e.clientY - canvasRect.top
    let dis = 20


    if (mouseLeftKeyDown) {
      let hypotenuse = getHypotenuse([0, 0], [x, y])
      console.log('hypotenuse', hypotenuse)
      let s = Math.abs(y) / Math.abs(hypotenuse)
      // console.log(s)
      let a = Math.acos(s)
      // console.log(a)
      let b = hudu2juedu(a) + 20
      console.log(b)
      let x1 = Math.sin(jiaodu2hudu(b)) * Math.abs(hypotenuse)
      let y1 = Math.cos(jiaodu2hudu(b)) * Math.abs(hypotenuse)


      // let r = getRoundOtherPoint([0, 0], hypotenuse, 40)
      console.log('x-------', x, '          y--------', y)
      console.log('x1-------', x1, '          y1--------', y1)
      // console.log('r', r)
      if (x - d - dd - d <= clearStartX) {
        clearStartX = x - d - dd - d
        clearEndX = ((oldOne.w - (x - startX)) + 2 * d) + 2 * d
      }
      if (x - dd - clearStartX >= clearEndX) {
        clearEndX = x - dd - clearStartX
      }

      ctx.lineWidth = 2 * d
      // ctx.rotate((-20 * Math.PI) / 180);
      clearAll()
      // draw()

      one.x = x1
      one.y = y1
      // console.log(one)
      one.w = oldOne.w - (x1 - startX)
      one.h = oldOne.h - (y1 - startY)
      renderBox2(one.x, one.y, one.w, one.h, 'black')
      renderLine2(one.x - d, one.y - d, one.w + 2 * d, one.h + 2 * d, 'rgb(139,80,255)')
      return
    }

    let a = 276, b = 258
    if ((a - dis < x && x < a + dis) &&
      (b - dis < y && y < b + dis)
    ) {
      canvas.addEventListener('mousedown', onMouseDown)
      canvas.addEventListener('mouseup', onMouseUp)
      // console.log('1')
      body.style.cursor = "e-resize"
    } else {
      canvas.removeEventListener('mousedown', onMouseDown)
      canvas.removeEventListener('mouseup', onMouseUp)
      mouseLeftKeyDown = false
      // console.log('2')
      body.style.cursor = "default"
    }
  }

  function moveRotate2(e: any) {
    let x = e.clientX - canvasRect.left
    let y = e.clientY - canvasRect.top

    let dis = 20
    if (mouseLeftKeyDown) {
      console.log('x-------', x, '          y--------', y)
      let a = getAngle([oldOne.x + oldOne.w / 2, oldOne.y + oldOne.h / 2],
        [startX, startY],
        [x, y]
      )
      // console.log(a)
      ctx.save()

      //一参：原点
      //二参：矩形中心点
      //结果：原点到矩形中心点的距离
      let hypotenuse = getHypotenuse([one.x - d, one.y - d],
        [one.x - d + (one.w + 2 * d) / 2, one.y - d + (one.h + 2 * d) / 2,])
      // ctx.arc(0, 0, hypotenuse + 4, 0, 2 * Math.PI);
      ctx.fillStyle = 'white'
      ctx.fillRect(-hypotenuse - 2 * d, -hypotenuse - 2 * d, hypotenuse * 2 + 4 * d, hypotenuse * 2 + 4 * d,);
      ctx.rotate((a * Math.PI) / 180);
      renderBox2(-one.w / 2, -one.h / 2, one.w, one.h, 'black')
      renderLine2(-one.w / 2 - d, -one.h / 2 - d, one.w + 2 * d, one.h + 2 * d, 'rgb(139,80,255)')
      ctx.restore()
      return
    }

    if ((active.endX - dis < x && x < active.endX + dis) &&
      (active.startY - dis < y && y < active.startY + dis)
    ) {
      canvas.addEventListener('mousedown', onMouseDown)
      canvas.addEventListener('mouseup', onMouseUp)
      // console.log('1')
      body.style.cursor = "ne-resize"
    } else {
      canvas.removeEventListener('mousedown', onMouseDown)
      canvas.removeEventListener('mouseup', onMouseUp)
      mouseLeftKeyDown = false
      // console.log('2')
      body.style.cursor = "default"
    }
  }

  function moveRotate(e: any) {
    let x = e.clientX - canvasRect.left
    let y = e.clientY - canvasRect.top
    // console.log('x-------', x, '          y--------', y)

    let dis = 20
    if (mouseLeftKeyDown) {
      console.log(one.x - d - (x - startX))
      // ctx.restore()
      clearAll()
      // renderLine2(one.x - d, y - dd, one.w + 2 * d + (x - startX), one.h + 2 * d, 'rgb(139,80,255)')
      // one.x = one.x
      one.y = y - d - (oldOne.y - 20)
      one.w = oldOne.w + (x - startX)
      one.h = oldOne.h - (y - startY)
      renderLine2(one.x, one.y, one.w, one.h, 'black')

      // renderBox(one.x, one.y, one.w, one.h, 'black')
      // renderLine(one.x - d, one.y - d, one.w + 2 * d, one.h + 2 * d, 'rgb(139,80,255)')

      return
    }

    let a = 322, b = 274
    if ((a - dis < x && x < a + dis) &&
      (b - dis < y && y < b + dis)
    ) {
      canvas.addEventListener('mousedown', onMouseDown)
      canvas.addEventListener('mouseup', onMouseUp)
      // console.log('1')
      body.style.cursor = "ne-resize"
    } else {
      canvas.removeEventListener('mousedown', onMouseDown)
      canvas.removeEventListener('mouseup', onMouseUp)
      mouseLeftKeyDown = false
      // console.log('2')
      body.style.cursor = "default"
    }
  }

  function getPath(box: Box) {
    box.leftX = box.x
    box.leftY = box.y
    box.rightX = box.leftX + box.w
    box.rightY = box.leftY + box.h
    if (!box.id) {
      box.id = Date.now()
    }
    box = getRotatePath(box)
    return box
  }

  function getRotatePath(box: any) {
    let {x, y, w, h, rotate} = box
    if (rotate === 0) {
      box.p1 = box.p2 = box.p3 = box.p4 = {x: 0, y: 0}
    } else {
      let p1 = {x, y}
      let p2 = {x: x + w, y}
      let p3 = {x: x + w, y: y + h}
      let p4 = {x, y: y + h}
      let c = {cx: x + w / 2, cy: y + h / 2}
      box.p1 = rotate2(p1, c, -rotate)
      box.p2 = rotate2(p2, c, -rotate)
      box.p3 = rotate2(p3, c, -rotate)
      box.p4 = rotate2(p4, c, -rotate)
    }
    box.ract = [box.p1, box.p2, box.p3, box.p4]
    return box
    // console.log(rotate2(p1, c, -rotate))
    // console.log(rotate2(p2, c, -rotate))
    // console.log(rotate2(p3, c, -rotate))
    // console.log(rotate2(p4, c, -rotate))
  }

  function isPointInRect(point: any, rect: any) {
    const [touchX, touchY] = point;
    // 长方形四个点的坐标
    const [[x1, y1], [x2, y2], [x3, y3], [x4, y4]] = rect;
    // 四个向量
    const v1 = [x1 - touchX, y1 - touchY];
    const v2 = [x2 - touchX, y2 - touchY];
    const v3 = [x3 - touchX, y3 - touchY];
    const v4 = [x4 - touchX, y4 - touchY];
    if (
      (v1[0] * v2[1] - v2[0] * v1[1]) > 0
      && (v2[0] * v4[1] - v4[0] * v2[1]) > 0
      && (v4[0] * v3[1] - v3[0] * v4[1]) > 0
      && (v3[0] * v1[1] - v1[0] * v3[1]) > 0
    ) {
      return true;
    }
    return false;
  }

  const [selectBox, setSelectBox] = useState<any>({})
  const [enter, setEnter] = useState(false)
  const [startX2, setStartX2] = useState(0)
  const [startY2, setStartY2] = useState(0)

  function onMouseDown1(e: any) {
    if (!selectBox) return
    if (e.which === 1) {
      setEnter(true)

      let old = clone(blocks)
      let rIndex = old.findIndex(v => v.id === selectBox.id)
      if (rIndex !== -1) {
        let now = old[rIndex]

        let d = 0.5
        let t = clone(now)
        t.id = Date.now()
        t.lineWidth = 2
        // t.x = t.x - d
        // t.y = t.y - d
        // t.w = t.w + 2 * d
        // t.h = t.h + 2 * d
        t.type = BlockType.SELECT
        t.children = []
        let cIndex = now.children.findIndex(v => v.type === BlockType.WRAPPER)
        console.log(cIndex)
        if (cIndex !== -1) {
          now.children[cIndex] = t
        } else {
          now.children.push(t)
        }
        // // console.log(t)
        // render(now)
      }
      setBlocks(old)
      setStartX2(e.clientX - canvasRect.left)
      setStartY2(e.clientY - canvasRect.top)
    }
    console.log('onMouseDown', e.clientX - canvasRect.left)
  }

  function onMouseUp1(e: any) {
    setEnter(false)
    setSelectBox({})
    // console.log(blocks)
    body.style.cursor = "default"
    console.log('onMouseUp')
  }

  function isPointInPath(x: number, y: number, box: Box) {
    // console.log('box.x', box.x, 'box.y', box.y)
    if (box.rotate !== 0) {
      let {w, h, rotate} = box
      let p1 = {x, y}
      let c = {cx: box.x + w / 2, cy: box.y + h / 2}
      let s = rotate33(p1, c, -rotate)
      x = s[0]
      y = s[1]
      // console.log(s)
      // let r = isPointInRect([x, y], box.ract)
      // console.log(r)
    }
    if (box.leftX! < x && x < box.rightX! && box.leftY! < y && y < box.rightY!) {
      console.log('在里面')
      //这里要加一个判断，如果有一个在里面了，后面就不需要再去判断了，
      // 否则后面判断时会走到else逻辑里面，给清除掉
      let d = .5
      let t = clone(box)
      t.lineWidth = 2
      t.x = t.x - d
      t.y = t.y - d
      t.w = t.w + 2 * d
      t.h = t.h + 2 * d
      console.log(t)
      t.type = BlockType.WRAPPER
      render(t)
      setSelectBox(clone(box))
      canvas.addEventListener('mousedown', onMouseDown1)
      canvas.addEventListener('mouseup', onMouseUp1)
      // console.log('1')
      // body.style.cursor = "ne-resize"
      // body.style.cursor = "pointer"
      // body.style.cursor = "move"
      return true
    } else {
      // console.log('不在里面')
      setSelectBox({})
      canvas.removeEventListener('mousedown', onMouseDown1)
      canvas.removeEventListener('mouseup', onMouseUp1)
      mouseLeftKeyDown = false
      // console.log('2')
      body.style.cursor = "default"
      draw2()
    }
  }

  function m(e: MouseEvent) {
    let x = e.clientX - canvasRect.left
    let y = e.clientY - canvasRect.top

    if (enter) {
      if (!selectBox.id) return
      // console.log('startX')
      // console.log('按下了')
      let dx = x - startX2
      let dy = y - startY2
      let old = clone(blocks)
      let rIndex = old.findIndex(v => v.id === selectBox.id)
      if (rIndex !== -1) {
        let now = old[rIndex]
        now.x = selectBox.x + dx
        now.y = selectBox.y + dy
        now = getPath(now)
      }
      setBlocks(old)
      return
    }
    // return console.log(x, y)
    // isPointInPath(x, y, blocks[0])
    for (let i = 0; i < blocks.length; i++) {
      let b = blocks[i]
      let r = isPointInPath(x, y, b)
      if (r) break
    }
  }

  return (
    <div>
      <div className='components'>
        <div className="component" onClick={() => location.reload()}>
          矩形
        </div>

      </div>
      <canvas
        onMouseMove={moveRotate2}
        id="canvas" ref={canvasRef} width={450} height={500}/>
    </div>
  )
}
