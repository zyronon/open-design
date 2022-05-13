import * as React from 'react'
import {Ref, useEffect, useRef} from "react";
import './index.scss'

export default function Canvas() {
  let canvasRef: any = useRef()
  let ctx: CanvasRenderingContext2D
  let canvas: HTMLCanvasElement
  let body: any = document.querySelector("body")

  let one = {
    x: 50,
    y: 50,
    w: 150,
    h: 150
  }
  let s = {
    startX: one.x,
    endX: one.x + one.w,
    startY: one.y,
    endY: one.y + one.h,
  }
  let d = 2
  let canvasRect: DOMRect

  let hover = {}
  let active = {
    startX: one.x - d,
    endX: one.x - d + one.w + 2 * d,
    startY: one.y - d,
    endY: one.y - d + one.h + 2 * d,
  }

  useEffect(() => {
    canvas = canvasRef.current
    // @ts-ignore
    ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeRect(0, 0, canvas.width, canvas.height)
    canvasRect = canvas.getBoundingClientRect()
    // console.log(canvasRect)
    draw()
  })

  function renderBox(x: number, y: number, w: number, h: number, color: any) {
    ctx.fillStyle = color
    ctx.fillRect(x, y, w, h)
  }

  function renderLine(x: number, y: number, w: number, h: number, color: any) {
    ctx.strokeStyle = color
    ctx.strokeRect(x, y, w, h)
  }

  function clear(x: number, y: number, w: number, h: number) {
    ctx.clearRect(x, y, w, h)
  }

  function draw() {
    // renderBox(one.x, one.y, one.w, one.h, 'black')
    // d = 1.5
    // ctx.lineWidth = 2 * d
    // renderLine(one.x - d, one.y - d, one.w + 2 * d, one.h + 2 * d, 'rgb(139,80,255)')
    ctx.strokeStyle = 'black'
    ctx.beginPath()
    for (let i = 0; i < 500; i += 5) {
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 500);
      // ctx.moveTo(20, 0);
      // ctx.lineTo(20, 300);
    }
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
  let startY

  function onMouseDown(e: any) {
    if (e.which === 1) {
      mouseLeftKeyDown = true
      startX = e.clientX - canvasRect.left
      if (startX < one.x) startX = one.x
    }
    console.log('onMouseDown')
  }


  function onMouseUp(e: any) {
    mouseLeftKeyDown = false
    body.style.cursor = "default"
    console.log('onMouseUp')
  }


  let clearStartX = one.x - 2 * d
  let clearEndX = one.w + 2 * d

  function move(e: any) {
    let x = e.clientX - canvasRect.left
    let y = e.clientY - canvasRect.top


    let dis = 5

    if (mouseLeftKeyDown) {

      // console.log('startX', startX)
      console.log('x', x)
      // console.log('one.w - (x - startX)', one.w - (x - startX))

      if (x < clearStartX) {
        clearStartX = x - 2 * d
        clearEndX = one.x - clearStartX + one.w
      }

      if (x > clearEndX) {
        clearEndX = x + 2 * d
      }

      console.log('clearEndX', clearEndX)


      // clear(0, 0, canvas.width, canvas.height)
      // renderBox(x, one.y, one.w - (x - startX), one.h, 'white')
      clear(clearStartX, one.y, clearEndX, one.h)
      renderBox(x, one.y, one.w - (x - startX), one.h, 'black')
      renderLine(x - d, one.y - d, (one.w - (x - startX)) + 2 * d, one.h + 2 * d, 'rgb(139,80,255)')

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

  return (
    <div>
      <div className='components'>
        <div className="component" onClick={() => location.reload()}>
          矩形
        </div>

      </div>
      <canvas
        onMouseMove={move}
        id="canvas" ref={canvasRef} width={500} height={500}/>
    </div>
  )
}
