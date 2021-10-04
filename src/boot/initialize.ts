import { boot } from 'quasar/wrappers';
import { init as initFirebase } from 'src/api/firebase';
import { init as initAxios } from 'src/boot/axios';

export default boot(async () => {
  await initFirebase();
  await initAxios();
});
