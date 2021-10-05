import { api } from 'src/boot/axios';
import { Product } from 'src/models/Product';
import { ref } from 'vue';
import { Notify } from 'quasar';

export const storefront = ref<Product[]>([]);
export const isLoading = ref(false);

export const getStorefront = async () => {
  isLoading.value = true;
  const res = await api.get('/storefront');
  if (!Array.isArray(res.data)) {
    Notify.create({ type: 'negative', message: 'An error occured trying to retrieve the storefront!' });
    isLoading.value = false;
    return;
  }
  storefront.value = res.data;
  isLoading.value = false;
};

(async () => {
  await getStorefront();
})();
