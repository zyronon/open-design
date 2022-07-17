import * as React from "react";
import {Routes, Route, Link, Navigate} from "react-router-dom";
import "./App.scss";
import asyncRoutes from "./router/asyncRoutes";
import constant from "./router/constant";
import {BaseSyntheticEvent, SyntheticEvent, useEffect, useRef} from "react";

function App() {
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

export default App

