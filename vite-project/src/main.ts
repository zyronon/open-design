import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import * as VueRouter from "vue-router";
import design from "./pages/design.vue"

const routes = [
  {path: '/', component: design},
]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
})

const app = createApp(App)
app.use(router)
app.mount('#app')
