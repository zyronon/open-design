// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './App'
// import './index.css'
//
// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// )


import * as React from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import "./index.css";
import 'moment/locale/zh-cn';
import 'antd/dist/antd.css';
import {createRoot} from "react-dom/client";
import {store} from './store/store.js';
import {Provider} from "react-redux";
import Canvas from "./pages/canvas/Canvas";
// import Canvas from "./pages/canvas/Canvas-hooks";
// import App from "./App";
import Test from "./pages/test/Test";


createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <Routes>
        <Route path={'/'} element={<Navigate to="/canvas"/>}/>
        <Route path={'/canvas'} element={<Canvas/>}/>
        <Route path={'/test'} element={<Test/>}/>
      </Routes>
      {/*<App/>*/}
    </Provider>
  </BrowserRouter>,
);