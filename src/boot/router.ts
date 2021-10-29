import { boot } from 'quasar/wrappers';
import { Router } from 'vue-router';

export let routerInstance: Router;

export default boot(({ router }) => {
  routerInstance = router;
});
