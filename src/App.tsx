import * as React from "react";
import {Routes, Route, Link, Navigate} from "react-router-dom";
import "./App.css";
import asyncRoutes from "./router/asyncRoutes";
import constant from "./router/constant";
import {BaseSyntheticEvent, SyntheticEvent, useEffect, useRef} from "react";

function App2() {
  const [router, setRouter] = React.useState(asyncRoutes);
  return (
    <Routes>
      {/*<Route path={'/'} element={<Redux/>}/>*/}
      <Route path={'/'} element={<Navigate to="/layout/hoc"/>}/>
      {
        router.map(v => {
          return <Route key={v.path} path={v.path} element={<v.component/>}>
            {
              v.children.map(v => {
                return <Route key={v.path} path={v.path} element={<v.component/>}/>
              })
            }
            <Route
              path="*"
              element={
                <main style={{padding: "1rem"}}>
                  <p>There's nothing here!</p>
                </main>
              }
            />
          </Route>
        })
      }
      {constant.map(v => {
        return <Route
          path={v.path}
          key={v.path}
          element={<v.component/>}/>
      })}
    </Routes>
  );
}

export default function Canvas() {
  let canvasRef: any = useRef()
  let ctx: CanvasRenderingContext2D

  useEffect(() => {
    let canvas: any = canvasRef.current
    ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeRect(0, 0, canvas.width, canvas.height)


    ctx.strokeRect(10, 10, 150, 150)
    ctx.strokeRect(0, 0, 170, 170)
  },)

  function move(e: any) {
    let x = e.clientX
    let y = e.clientY
    let is = ctx.isPointInPath(x, y)
    console.log(is)
  }

  return (
    <div>
      <canvas
        onMouseMove={move}
        id="canvas" ref={canvasRef} width={500} height={500}/>
    </div>
  )
}
