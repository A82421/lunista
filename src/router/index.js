// src/router/index.js
import DashboardView from '@/components/DashboardView.vue';
import NavBar from '@/components/NavBar.vue';
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    redirect: '/navbar', // Redirigir a dashboard
  },
  {
    path: '/dashboardview',
    name: 'Dashboard',
    component: DashboardView,
  },
  {
    path: '/navbar',
    name: 'NavBar',
    component: NavBar,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes, 
});

export default router;
