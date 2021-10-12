import { api } from 'src/boot/axios';
import { Product } from 'src/models/Product';
import { ResponseData } from 'src/models/ResponseData';
import { ref } from 'vue';
import { Notify } from 'quasar';

export const isLoading = ref(false);

export const getProduct = async (productId: string): Promise<Product | null> => {
  isLoading.value = true;
  const res = await api.get<ResponseData<Product>>('/product/' + productId);
  if (res.data.data == null) {
    Notify.create({ type: 'negative', message: 'There is no such product with the given ID.' });
    isLoading.value = false;
    return null;
  }
  isLoading.value = false;
  return res.data.data;
};
