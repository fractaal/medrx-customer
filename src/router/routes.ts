import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/SimpleLayout.vue'),
    children: [{ path: '', component: () => import('pages/Splash.vue') }],
  },
  {
    path: '/login',
    component: () => import('layouts/SimpleLayout.vue'),
    children: [{ path: '', component: () => import('pages/Login.vue') }],
  },
  {
    path: '/home',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Home.vue') }],
  },
  {
    path: '/product/:id',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/ProductPage.vue') }],
  },
  {
    path: '/upload',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Upload.vue') }],
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('layouts/HeaderLayout.vue'),
    children: [{ path: '', component: () => import('src/pages/Setting.vue') }],
    meta: {
      name: 'settings',
      statusBarColor: '#30b59e',
      statusBarIsDark: true,
    },
  },
  {
    path: '/register',
    component: () => import('layouts/FancyLayout.vue'),
    children: [{ path: '', component: () => import('src/pages/Register.vue') }],
    meta: {
      name: 'signUp',
      statusBarColor: '#30b59e',
      statusBarIsDark: true,
      icon: 'emoji_people',
    },
  },
  {
    path: '/verify',
    component: () => import('layouts/FancyLayout.vue'),
    children: [{ path: '', component: () => import('src/pages/PhoneVerify.vue') }],
    meta: {
      name: 'verify',
      statusBarColor: '#30b59e',
      statusBarIsDark: true,
      icon: 'local_phone',
    },
  },
  {
    path: '/cart',
    component: () => import('layouts/HeaderLayout.vue'),
    children: [{ path: '', component: () => import('pages/Cart.vue') }],
    meta: {
      name: 'My Cart',
      statusBarColor: '#30b59e',
      statusBarIsDark: true,
    },
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
