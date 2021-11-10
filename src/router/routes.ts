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
    path: '/vendor/:id',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/VendorPage.vue') }],
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
    path: '/order',
    name: 'Order',
    component: () => import('layouts/HeaderLayout.vue'),
    children: [{ path: '', component: () => import('src/pages/Order.vue') }],
    meta: {
      name: 'Order',
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
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Cart.vue') }],
    meta: {
      name: 'My Cart',
      statusBarColor: '#30b59e',
      statusBarIsDark: true,
    },
  },
  {
    path: '/search',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Search.vue') }],
    meta: {
      name: 'Search',
      statusBarColor: '#30b59e',
      statusBarIsDark: true,
    },
  },
  // Pharmacist Routes
  {
    path: '/pharmacist',
    component: () => import('layouts/PharmacistLayout.vue'),
    children: [{ path: '', component: () => import('pages/Pharmacist/Idle.vue') }],
    meta: {
      requiredRoles: 'pharmacist',
      name: 'Pharmacist',
      statusBarColor: '#30b59e',
      statusBarIsDark: true,
    },
  },
  {
    path: '/pharmacist/view-prescription/:id',
    component: () => import('layouts/PharmacistLayout.vue'),
    children: [{ path: '', component: () => import('pages/Pharmacist/View.vue') }],
    meta: {
      requiredRoles: 'pharmacist',
      name: 'View Prescription',
      statusBarColor: '#30b59e',
      statusBarIsDark: true,
    },
  },
  {
    path: '/pharmacist/transcribe-prescription/:id',
    component: () => import('layouts/PharmacistLayout.vue'),
    children: [{ path: '', component: () => import('pages/Pharmacist/Transcribe.vue') }],
    meta: {
      requiredRoles: 'pharmacist',
      name: 'Transcribe Prescription',
      statusBarColor: '#30b59e',
      statusBarIsDark: true,
    },
  },
  {
    path: '/pharmacist/restricted-users',
    component: () => import('layouts/PharmacistLayout.vue'),
    children: [{ path: '', component: () => import('pages/Pharmacist/Restricted.vue') }],
    meta: {
      requiredRoles: 'pharmacist',
      name: 'Restricted Users',
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
