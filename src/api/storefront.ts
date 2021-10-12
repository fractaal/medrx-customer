import { api } from 'src/boot/axios';
import { Product } from 'src/models/Product';
import { ref } from 'vue';
import { Notify } from 'quasar';
import { ResponseData } from 'src/models/ResponseData';

export const storefront = ref<Product[]>([]);
export const isLoading = ref(false);

export const getStorefront = async () => {
  isLoading.value = true;
  const res = await api.get<ResponseData<Product[] | undefined>>('/storefront');
  if (!Array.isArray(res.data.data)) {
    Notify.create({ type: 'negative', message: 'An error occured trying to retrieve the storefront!' });
    isLoading.value = false;
    return;
  }
  storefront.value = res.data.data;
  isLoading.value = false;
};

(async () => {
  await getStorefront();
})();
