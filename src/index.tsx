import * as React from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import "./index.css";
import 'moment/locale/zh-cn';
import 'antd/dist/antd.css';
import {createRoot} from "react-dom/client";
import {store} from './store/store';
import {Provider} from "react-redux";
import './types/global.d.ts'
import Test from "./pages/test/Test";
import Design from "./pages/canvas/Design";
import Home from "./pages/home";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Provider store={store}>
      <Routes>
        <Route path={'/'} element={<Navigate to="/design"/>}/>
        <Route path={'/design'} element={<Design/>}/>
        <Route path={'/home'} element={<Home/>}/>
        <Route path={'/test'} element={<Test/>}/>
        <Route path={'*'} element={<Navigate to="/design"/>}/>
      </Routes>
    </Provider>
  </BrowserRouter>,
);