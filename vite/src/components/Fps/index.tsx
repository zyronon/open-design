import React, {memo, useEffect, useState} from "react";
import {retry} from "@reduxjs/toolkit/query";

// @ts-ignore
export default memo(() => {
  const [fps, setFps] = useState<number>(0)

  useEffect(() => {
    let time: number

    function getFps() {
      let lastTime = performance.now()
      let frame = 0
      let lastFameTime = performance.now()
      const loop = () => {
        let now = performance.now()
        let fs = (now - lastFameTime)
        lastFameTime = now
        let fps = Math.round(1000 / fs)
        frame++
        if (now > 1000 + lastTime) {
          fps = Math.round((frame * 1000) / (now - lastTime))
          setFps(fps)
          frame = 0
          lastTime = now
        }
        time = window.requestAnimationFrame(loop)
      }
      loop()
    }

    getFps()
    return () => {
      time && cancelAnimationFrame(time)
    }
  }, [])

  return fps
})