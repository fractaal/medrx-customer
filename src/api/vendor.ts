import { api } from 'src/boot/axios';
import { Data } from 'src/models/Vendor';
import { ResponseData } from 'src/models/ResponseData';
import { ref } from 'vue';
import { Notify } from 'quasar';

export const isLoading = ref(false);

export const getVendor = async (vendorId: string, productsPageNumber = 0): Promise<Data | null> => {
  isLoading.value = true;
  const res = await api.get<ResponseData<Data>>('/vendor/' + vendorId + '/' + productsPageNumber.toString());
  if (res.data.data == null) {
    Notify.create({ type: 'negative', message: 'There is no such vendor with the given ID.' });
    isLoading.value = false;
    return null;
  }
  isLoading.value = false;
  return res.data.data;
};
