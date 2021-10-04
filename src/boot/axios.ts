import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import { getRemoteConfig, getString } from 'firebase/remote-config';
import { onAuthStateChanged, getAuth } from 'firebase/auth';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: 'PLACEHOLDER' });

const init = () => {
  return new Promise<void>((resolve, reject) => {
    try {
      api.defaults.baseURL = getString(getRemoteConfig(), 'serverAddress');

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onAuthStateChanged(getAuth(), async (user) => {
        if (user === null) return;
        console.log('Updating ID token in axios...');
        api.defaults.headers.common['Authorization'] = await user.getIdToken(true);
        console.log('New axios defaults: ', api.defaults);
        resolve();
      });
    } catch (err) {
      reject(err);
    }
  });
};

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api, init };
