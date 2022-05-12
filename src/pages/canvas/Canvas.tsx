import * as React from 'react'
import {Ref, useEffect, useRef} from "react";

export default function Canvas() {
  let canvasRef: any = useRef()


  useEffect(() => {
    let canvas: any = canvasRef.current
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    ctx.fillRect(0, 0, 150, 150)
  },)

  return (
    <div>
      <canvas id="canvas" ref={canvasRef} width={500} height={500}/>
    </div>
  )
}