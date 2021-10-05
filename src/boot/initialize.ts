import { boot } from 'quasar/wrappers';
import { init as initFirebase } from 'src/api/firebase';
import { init as initAxios } from 'src/boot/axios';

export default boot(async () => {
  console.log('Initializing Firebase...');
  await initFirebase();
  console.log('Done! Initializing Axios...');
  await initAxios();
  console.log('Done!');
});
