import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/SimpleLayout.vue'),
    children: [{ path: '', component: () => import('pages/Splash.vue')}]
  },
  {
    path: '/login',
    component: () => import('layouts/SimpleLayout.vue'),
    children: [{ path: '', component: () => import('pages/Login.vue')}]
  },
  {
    path: '/home',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Home.vue') }],
  },
  {
    path: '/upload',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Upload.vue') }],
  },
  {
    path: '/settings',
    component: () => import('layouts/SettingsLayout.vue'),
    children: [{ path: '', component: () => import('pages/settingPage.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
