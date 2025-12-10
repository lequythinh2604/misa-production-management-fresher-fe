import Shift from '@/views/dictionary/shift/Shift.vue'
import Temp from '@/views/temps/Temp.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/production-category/shift',
      name: 'Shift',
      component: Shift,
    },
    {
      path: '/:catchAll(.*)',
      name: 'NotFound',
      component: Temp,
    },
  ],
})

export default router
