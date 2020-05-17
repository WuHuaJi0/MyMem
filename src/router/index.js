import Vue from 'vue'
import VueRouter from 'vue-router'

import NewConnect from "../components/NewConnect";

Vue.use(VueRouter)

const routes = [
  {
    path: '/new',component: NewConnect,
  }
]

// eslint-disable-next-line no-new
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
