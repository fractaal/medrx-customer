import { api } from 'src/boot/axios';
import { Products, Vendor } from 'src/models/Vendor';
import { ResponseData } from 'src/models/ResponseData';
import { ref } from 'vue';
import { Notify } from 'quasar';

export const vendorIsLoading = ref(false);
export const productsIsLoading = ref(false);

export const getVendor = async (vendorId: string): Promise<Vendor | null> => {
  vendorIsLoading.value = true;
  const res = await api.get<ResponseData<Vendor>>('/vendor/' + vendorId);
  if (res.data.data == null) {
    Notify.create({ type: 'negative', message: 'There is no such vendor with the given ID.' });
    vendorIsLoading.value = false;
    return null;
  }
  vendorIsLoading.value = false;
  return res.data.data;
};

export const getVendorProducts = async (vendorId: string, pageNumber = 0) => {
  productsIsLoading.value = true;
  const res = await api.get<ResponseData<Products>>(`/vendor/${vendorId}/products/${pageNumber}`);
  if (res.data.data == null) {
    Notify.create({ type: 'negative', message: 'There is no such vendor with the given ID.' });
    productsIsLoading.value = false;
    return null;
  }
  productsIsLoading.value = false;
  return res.data.data;
};
