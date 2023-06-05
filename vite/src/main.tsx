import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import '@/assets/css/index.scss'
import 'moment/locale/zh-cn'
import {store} from './store/store'
import {Provider} from "react-redux"
import './types/global.d.ts'
import './types/instance'
import Design from "./pages/canvas/Design"
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom"


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <Routes>
          <Route path={'/'} element={<Navigate to="/design"/>}/>
          <Route path={'/design'} element={<Design/>}/>
          {/*<Route path={'/home'} element={<Home/>}/>*/}
          {/*<Route path={'/test'} element={<Test/>}/>*/}
          <Route path={'*'} element={<Navigate to="/design"/>}/>
        </Routes>
      </Provider>
    </BrowserRouter>,
  </React.StrictMode>,
)
