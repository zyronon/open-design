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
    ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeRect(0, 0, canvas.width, canvas.height)
    canvasRect = canvas.getBoundingClientRect()
    draw()
  })


  function draw() {
    // d = 5
    // ctx.clearRect(one.x - d, one.y - d, one.w + 2 * d, one.h + 2 * d)
    ctx.strokeStyle = 'black'
    ctx.fillRect(one.x, one.y, one.w, one.h)
    d = 1.5
    ctx.lineWidth = 2 * d
    ctx.strokeStyle = 'rgb(139,80,255)'
    ctx.strokeRect(one.x - d, one.y - d, one.w + 2 * d, one.h + 2 * d)
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


  function move(e: any) {
    let x = e.clientX - canvasRect.left
    let y = e.clientY - canvasRect.top


    let dis = 5

    if (mouseLeftKeyDown) {

      console.log('startX', startX)
      console.log('x', x)
      console.log('one.w - (x - startX)', one.w - (x - startX))
      ctx.strokeStyle = 'black'
      ctx.clearRect(one.x, one.y, one.w, one.h)
      ctx.fillRect(x, one.y, one.w - (x - startX), one.h)
      // d = 1.5
      // ctx.lineWidth = 2 * d
      // ctx.strokeStyle = 'rgb(139,80,255)'
      // ctx.strokeRect(one.x - d, one.y - d, one.w + 2 * d, one.h + 2 * d)
      console.log('return')
      return
    }

    if ((active.startX - dis < x && x < active.startX + dis) &&
      (active.startY < y && y < active.endY)
    ) {
      canvas.addEventListener('mousedown', onMouseDown)
      canvas.addEventListener('mouseup', onMouseUp)
      console.log('1')
      body.style.cursor = "e-resize"
    } else {
      canvas.removeEventListener('mousedown', onMouseDown)
      canvas.removeEventListener('mouseup', onMouseUp)
      mouseLeftKeyDown = false
      console.log('2')
      body.style.cursor = "default"
    }
  }

  return (
    <div>
      <div className='components'>
        <div className="component">
          矩形
        </div>

      </div>
      <canvas
        onMouseMove={move}
        id="canvas" ref={canvasRef} width={300} height={300}/>
    </div>
  )
}
