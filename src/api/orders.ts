import { ref, watchEffect } from 'vue';
import * as db from '@firebase/database';
import { token } from './auth';
import { database } from './firebase';
import { getAuth } from 'firebase/auth';
import { api } from 'src/boot/axios';
import { Notify } from 'quasar';

export const orders = ref([]);
export const ordersIsLoading = ref(false);
export const ordersPageSize = ref(10);
export const ordersPageNumber = ref(0);

export const getOrders = async () => {
  ordersIsLoading.value = true;
  try {
    orders.value = (await api.get(`/orders/${ordersPageSize.value}/${ordersPageNumber.value}`)).data.data.results;
  } catch (err) {
    Notify.create({ type: 'negative', message: 'There was an error trying to get your orders.' });
  }
  ordersIsLoading.value = false;
};

// eslint-disable-next-line @typescript-eslint/no-misused-promises
watchEffect(() => getOrders());
