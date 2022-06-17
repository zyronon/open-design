import Home from "../pages/home/Home";
import About from "../pages/about/About";
import BaseLayout from "../pages/layout/BaseLayout";
import Hooks from "../pages/hooks/Hooks";
import Redux from "../pages/reduxPage/Redux";
import Hoc from "../pages/hoc/Hoc";
import Canvas from "../pages/canvas/Canvas";
import Test from "../pages/test/Test"

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
      },
      {
        path: '/layout/canvas',
        component: Canvas,
      },
    ]
  },
]