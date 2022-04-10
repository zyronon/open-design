import * as React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import "./index.css";
import zhCN from 'antd/lib/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import 'antd/dist/antd.css';
import {createRoot} from "react-dom/client";
import App from "./App";
import { store } from './store/store';
import {Provider} from "react-redux";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
);