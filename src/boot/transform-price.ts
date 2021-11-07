import { boot } from 'quasar/wrappers';
import transformPrice from 'src/api/util/transform-price';

export default boot(({ app }) => {
  app.provide('transformPrice', transformPrice);
});
