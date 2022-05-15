import * as React from 'react'
import {Ref, useEffect, useRef} from "react";
import './index.scss'
import _ from 'lodash'

export default function Canvas() {
  let canvasRef: any = useRef()
  let ctx: CanvasRenderingContext2D
  let canvas: HTMLCanvasElement
  let body: any = document.querySelector("body")

  let one = {
    x: 50,
    y: 50,
    w: 50,
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
    d = 2
    ctx.lineWidth = 2 * d
    renderBox(one.x, one.y, one.w, one.h, 'black')
    renderLine(one.x - d, one.y - d, one.w + 2 * d, one.h + 2 * d, 'rgb(139,80,255)')
    //这里x必须多1d，w要多2d，y和h同理
    // clear(one.x - 2 * d, one.y - 2 * d, one.w + 4 * d, one.h + 4 * d)
    // d = 1
    ctx.lineWidth = 1
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
  let dd: any

  function onMouseDown(e: any) {
    if (e.which === 1) {
      mouseLeftKeyDown = true
      startX = e.clientX - canvasRect.left
      // if (startX < one.x) startX = one.x
      dd = startX - one.x
    }
    console.log('onMouseDown')
  }

  function onMouseUp(e: any) {
    mouseLeftKeyDown = false
    body.style.cursor = "default"
    console.log('onMouseUp')
    active = {
      startX: one.x - d,
      endX: one.x - d + one.w + 2 * d,
      startY: one.y - d,
      endY: one.y - d + one.h + 2 * d,
    }
    oldOne = _.clone(one)
  }

  let clearStartX = one.x - 2 * d
  let clearEndX = one.w + 4 * d

  let oldOne = _.clone(one)

  function moveStretch(e: any) {
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
      renderBox(one.x, one.y, one.w, one.h, 'black')
      renderLine(one.x - d, one.y - d, one.w + 2 * d, one.h + 2 * d, 'rgb(139,80,255)')
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

  active = {
    startX: one.x - d,
    endX: one.x - d + one.w + 2 * d,
    startY: one.y - d,
    endY: one.y - d + one.h + 2 * d,
  }

  function moveScale(e: any) {
    let x = e.clientX - canvasRect.left
    let y = e.clientY - canvasRect.top
    let dis = 20

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

  return (
    <div>
      <div className='components'>
        <div className="component" onClick={() => location.reload()}>
          矩形
        </div>

      </div>
      <canvas
        onMouseMove={moveScale}
        id="canvas" ref={canvasRef} width={500} height={500}/>
    </div>
  )
}
