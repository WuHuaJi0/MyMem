import Vue from 'vue'
import VueRouter from 'vue-router'

import NewConnect from "../components/NewConnect";
import Browser from "../components/Browser";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',component: NewConnect,
  },
  {
    path: '/home',component: Browser,
  }
]

// eslint-disable-next-line no-new
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
