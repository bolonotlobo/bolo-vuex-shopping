import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home',component: ()=>import('@/views/Home')},
  { path: '/market',component: ()=> import('@/views/Market')}
]
const router = new VueRouter({
  linkActiveClass: 'myactive',
  routes
})

export default router
