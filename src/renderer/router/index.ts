import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/browser',
    name: 'Browser',
    component: () => import('../views/BrowserView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
