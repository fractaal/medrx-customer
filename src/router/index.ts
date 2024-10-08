import { route } from 'quasar/wrappers';
import { createMemoryHistory, createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import routes from './routes';
import mobile from 'src/api/mobile';

let hasAlreadyNavigatedToOtherRoutes = false;

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach(async (to, from, next) => {
    // Splash screen navigation guard
    if (to.path === '/' && hasAlreadyNavigatedToOtherRoutes) {
      next('/home');
      return;
    } else if (to.path !== '/') {
      hasAlreadyNavigatedToOtherRoutes = true;
    }

    // Route navigation delay
    if (from.fullPath !== '/') {
      await new Promise((r) => setTimeout(r, 250));
    }

    // Setting status bar color per route
    mobile.setStatusBarColor(to.meta?.statusBarColor, to.meta?.statusBarIsDark);
    next();
  });

  return Router;
});
