import * as React from 'react'
import {useEffect, useRef} from "react";

export default function Canvas() {
  let canvasRef = useRef()

  useEffect(() => {
    let canvas: any = canvasRef.current
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');

    ctx.fillStyle = 'green';
    ctx.fillRect(10, 10, 150, 100);
  }, [])

  return (
    <div>
      <canvas id="canvas" ref={canvasRef}/>
    </div>
  )
}