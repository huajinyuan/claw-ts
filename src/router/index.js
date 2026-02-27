import { createRouter, createWebHistory } from 'vue-router'
import Designer from '../components/Designer.vue'

const routes = [
  {
    path: '/',
    name: 'Designer',
    component: Designer
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router