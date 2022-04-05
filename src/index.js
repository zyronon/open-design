import * as React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import "./index.css";
import zhCN from 'antd/lib/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import 'antd/dist/antd.css';
import App from "./App";
import {createRoot} from "react-dom/client";
import Home from "./pages/home/Home";
import About from "./pages/about/About";
import Login from "./pages/login/Login";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/home" element={<Home/>}/>
      <Route path="/about" element={<About/>}/>
    </Routes>
  </BrowserRouter>,
);