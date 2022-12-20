import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FilePageView from '../views/FilePageView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/file/:id',
    name: 'file',
    component: FilePageView
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
