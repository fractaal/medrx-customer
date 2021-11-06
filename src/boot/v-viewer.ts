import { boot } from 'quasar/wrappers';
import 'viewerjs/dist/viewer.css';
import VueViewer from 'v-viewer';

export default boot(({ app }) => {
  // @ts-ignore
  app.use(VueViewer);
});
