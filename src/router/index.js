import { createRouter, createWebHistory } from 'vue-router'

import DashboardView from '../views/DashboardView.vue'
import MatchesView from '../views/MatchesView.vue'
import MatchDetailView from '../views/MatchDetailView.vue'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: DashboardView,
  },
  {
    path: '/matches',
    name: 'matches',
    component: MatchesView,
  },
  {
    path: '/matches/:id',
    name: 'match-detail',
    component: MatchDetailView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router