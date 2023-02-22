import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/home/HomeView.vue'
import FilePageView from '../views/home/FilePageView.vue'
import DatabasesView from '../views/database/DatabasesView.vue'
import DatabasePageView from '../views/database/DatabasePageView.vue'
import TablePageView from '../views/table/TablePageView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/databases',
    name: 'databases',
    component: DatabasesView
  },
  //
  {
    path: '/file/:id',
    name: 'file',
    component: FilePageView
  },
  {
    path: '/database/:id',
    name: 'database',
    component: DatabasePageView
  },
  {
    path: '/table/:database/:table',
    name: 'table',
    component: TablePageView
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
