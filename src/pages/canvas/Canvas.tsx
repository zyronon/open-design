import * as React from 'react'
import {MouseEvent, Ref, useEffect, useRef, useState} from "react";
import './index.scss'
import _, {clone} from 'lodash'
import {getAngle, getHypotenuse, getRoundOtherPoint} from "../../utils";

enum BlockType {
  LINE = 0,
  FILL = 1
}

interface Box {
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
  const [blocks, setBlocks] = useState<any[]>([])
  const [canvasRect, setCanvasRect] = useState<DOMRect>(null!)

  useEffect(() => {
    let canvas = canvasRef.current
    setCanvas(canvas)
    // @ts-ignore
    setCtx(canvas.getContext('2d'))
    setCanvasRect(canvas.getBoundingClientRect())
    let allLine = {
      x: 0,
      y: 0,
      w: canvas.width,
      h: canvas.height,
      rotate: 0,
      lineWidth: 1,
      type: BlockType.LINE,
      color: 'black'
    }
    let oneBox = {
      x: 350,
      y: 150,
      w: 50,
      h: 150,
      rotate: 20,
      lineWidth: 1,
      type: BlockType.FILL,
      color: 'black'
    }
    let oneBoxLine = {
      x: oneBox.x - d,
      y: oneBox.y - d,
      w: oneBox.w + 2 * d,
      h: oneBox.h + 2 * d,
      rotate: 20,
      lineWidth: 4,
      type: BlockType.LINE,
      color: 'rgb(139,80,255)'
    }
    let towBox = {
      x: 50,
      y: 50,
      w: 150,
      h: 150,
      rotate: 0,
      lineWidth: 1,
      type: BlockType.FILL,
      color: 'black'
    }
    let threeBox = {
      x: 350,
      y: 50,
      w: 50,
      h: 200,
      rotate: 0,
      lineWidth: 1,
      type: BlockType.FILL,
      color: 'WHITE'
    }
    setBlocks(o => {
      // o.push(getPath(allLine))
      o.push(getPath(oneBox))
      // o.push(getPath(oneBoxLine))
      // o.push(getPath(towBox))
      o.push(getPath(threeBox))
      return clone(o)
    })
  }, [])

  useEffect(() => {
    ctx && draw2()
  }, [blocks])

  function draw2() {
    ctx.lineWidth = 7
    ctx.fillRect(10.5, 10.5, 1, 100)
    ctx.fillRect(10, 120, 1, 100)

    ctx.beginPath()
    ctx.moveTo(15, 10)
    ctx.lineTo(115, 10)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(15, 20.5)
    ctx.lineTo(115, 20.5)
    ctx.stroke()


    return
    ctx.save()
    // ctx.translate(0.5, 0.5);
    clear(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'square'
    blocks.map(v => {
      ctx.save()
      ctx.rotate((v.rotate * Math.PI) / 180);
      ctx.lineWidth = v.lineWidth
      if (v.type === BlockType.LINE) {
        renderLine2(v.x, v.y, v.w, v.h, v.color)
      } else {
        renderBox2(v.x, v.y, v.w, v.h, v.color)
      }
      ctx.restore()
    })
    ctx.restore()
  }

  function draw() {
    d = 2
    ctx.lineWidth = 2 * d
    renderBox2(one.x, one.y, one.w, one.h, 'black')
    renderLine2(one.x - d, one.y - d, one.w + 2 * d, one.h + 2 * d, 'rgb(139,80,255)')
    //这里x必须多1d，w要多2d，y和h同理
    // clear(one.x - 2 * d, one.y - 2 * d, one.w + 4 * d, one.h + 4 * d)
    // d = 1
    ctx.lineWidth = 1
    ctx.strokeStyle = 'black'
    ctx.beginPath()
    for (let i = 0; i < 500; i += 5) {
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 500);
    }
    // ctx.stroke()
    ctx.lineWidth = 2 * d
  }

  function clear(x: number, y: number, w: number, h: number) {
    ctx.clearRect(x, y, w, h)
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

      //rotate
      // ctx.translate(oldOne.x + oldOne.w / 2, oldOne.y + oldOne.h / 2);


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
    return;
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
      // console.log('x-------', x, '          y--------', y)
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
    return box
  }

  function isPointInPath(x: number, y: number, box: Box) {
    if (box.leftX! < x && x < box.rightX! && box.leftY! < y && y < box.rightY!) {
      console.log('在里面')
      //这里要加一个判断，如果有一个在里面了，后面就不需要再去判断了，
      // 否则后面判断时会走到else逻辑里面，给清除掉
      d = 1
      // ctx.save()
      ctx.lineWidth = 2.5
      // renderLine2(box.x + d, box.y + d, box.w - 2 * d, box.h - 2 * d, 'rgb(139,80,255)')
      ctx.save()

      renderLine2(box.x - d, box.y - d, box.w + 2 * d, box.h + 2 * d, 'rgb(139,80,255)')
      // renderLine2(box.x, box.y, box.w, box.h, 'rgb(139,80,255)')
      ctx.restore()
      return true
    } else {
      draw2()
    }
  }

  function m(e: MouseEvent) {
    let x = e.clientX - canvasRect.left
    let y = e.clientY - canvasRect.top

    // isPointInPath(x, y, blocks[1])

    for (let i = 0; i < blocks.length; i++) {
      let b = blocks[i]
      // let r = isPointInPath(x, y, b)
      // if (r) break
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
        onMouseMove={m}
        id="canvas" ref={canvasRef} width={450} height={500}/>
    </div>
  )
}
