import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import { getRemoteConfig, getString } from 'firebase/remote-config';
import { getAuth, Auth } from 'firebase/auth';
import { Dialog } from 'quasar';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

let alreadyDisplayedSessionInvalidatedDialog = false;

/**
 * This is a very hacky way for Axios to interact with Firebase.
 * The reason why we can't just import Firebase functions here agad-agad
 * is because Axios is initialized first before Firebase, and by importing
 * Firebase functions here we make Firebase initialize first instead.
 *
 * Now that I think about it, though, this can be easily incorporated into
 * the init function in this module.
 */

// TODO: ^^^^

// Once firebase is initialized, this should be an actual function now.
let sessionInvalidationFunction: ((...args: any[]) => Promise<void>) | null = null;

// Firebase uses this function to set the variable above.
export const setSessionInvalidationFunction = (func: (...args: any[]) => Promise<void>) => {
  console.log('Session invalidation function set to', func.name.length === 0 ? 'Anonymous function' : func.name);
  sessionInvalidationFunction = func;
};

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: 'PLACEHOLDER' });

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const statusCode = error.response ? error.response.status : null;
    if (statusCode == 401) {
      // user is unauthorized, prompt them to login again.
      if (alreadyDisplayedSessionInvalidatedDialog) return;

      alreadyDisplayedSessionInvalidatedDialog = true;

      Dialog.create({
        color: 'red',
        title: 'Session invalidated!',
        message: 'Please log in again.',
        persistent: true,
      }).onOk(async () => {
        if (sessionInvalidationFunction) {
          await sessionInvalidationFunction();
          alreadyDisplayedSessionInvalidatedDialog = false;
        } else {
          console.error(
            'Attempt to call session invalidation function failed - value was',
            sessionInvalidationFunction
          );
          console.error(
            "It's highly unlikely, but perhaps the Firebase module was uninitialized before the MedRx backend returned 401 unauthorized."
          );
        }
      });
    } else {
      throw error;
    }
  }
);

const getIdToken = async (auth: Auth) => {
  console.log('Updating ID token in axios...');
  api.defaults.headers.common['Authorization'] = await auth.currentUser.getIdToken();
  console.log('New axios defaults: ', api.defaults);
};

const init = () => {
  return new Promise<boolean>((resolve) => {
    // if (process.env.DEV) {
    if (false) {
      api.defaults.baseURL = 'http://localhost:3000';
    } else {
      api.defaults.baseURL = getString(getRemoteConfig(), 'serverAddress');
    }

    const auth = getAuth();

    if (auth.currentUser) getIdToken(auth).then(() => resolve(true));
    else resolve(false);
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
