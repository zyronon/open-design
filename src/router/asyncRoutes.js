import {Layout} from "antd";
import Home from "../pages/home/Home";
import About from "../pages/about/About";
import BaseLayout from "../pages/layout/BaseLayout";
import Hooks from "../pages/hooks/Hooks";
import Redux from "../pages/reduxPage/Redux";
import Hoc from "../pages/hoc/Hoc";

export default [
  {
    path: '/layout',
    component: BaseLayout,
    children: [
      {
        path: '/layout/home',
        component: Home,
      },
      {
        path: '/layout/about',
        component: About,
      },
      {
        path: '/layout/hooks',
        component: Hooks,
      },
      {
        path: '/layout/reduxPage',
        component: Redux,
      },
      {
        path: '/layout/hoc',
        component: Hoc,
      }
    ]
  }
]