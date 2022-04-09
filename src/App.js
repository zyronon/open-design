import * as React from "react";
import {Routes, Route, Link, Redirect} from "react-router-dom";
import "./App.css";
import Home from "./pages/home/Home";
import Redux from "./pages/reduxPage/Redux";
import {Button} from "antd";
import asyncRoutes from "./router/asyncRoutes";
import constant from "./router/constant";

function App() {
  const [router, setRouter] = React.useState(asyncRoutes);
  return (
    <Routes>
      <Route path={'/'} element={<Redux/>}/>
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
