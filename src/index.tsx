import * as React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./index.css";
import 'moment/locale/zh-cn';
import 'antd/dist/antd.css';
import { createRoot } from "react-dom/client";
import { store } from './store/store';
import { Provider } from "react-redux";
import Test from "./pages/test/Test";
import Design from "./pages/canvas/Design";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Provider store={store}>
      <Routes>
        <Route path={'/'} element={<Navigate to="/design"/>}/>
        <Route path={'/design'} element={<Design/>}/>
        <Route path={'/test'} element={<Test/>}/>
      </Routes>
    </Provider>
  </BrowserRouter>,
);