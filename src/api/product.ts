import { api } from 'src/boot/axios';
import { Product } from 'src/models/Product';
import { ref } from 'vue';
import { Notify } from 'quasar';

export const isLoading = ref(false);

export const getProduct = async (productId: string): Promise<Product | null> => {
  isLoading.value = true;
  const res = await api.get('/product/' + productId);
  if (res.data == null) {
    Notify.create({ type: 'negative', message: 'An error occured trying to retrieve the storefront!' });
    isLoading.value = false;
    return null;
  }
  isLoading.value = false;
  return res.data;
};
