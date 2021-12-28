import { ref } from 'vue';
import * as db from 'firebase/database';
import { token } from './auth';
import { database } from './firebase';
import { getAuth } from 'firebase/auth';
import { Location } from 'src/models/Location';
import { DeliveryLog } from 'src/models/DeliveryLog';

export const hasActiveDelivery = ref(false);
export const activeDeliveryLocation = ref<Location>(null);
export const deliveryLogs = ref<DeliveryLog[]>([]);

db.onValue(
  db.ref(database, `${token.value.claims.region}/${token.value.claims.city}/${getAuth().currentUser.uid}/delivery`),
  (snapshot) => {
    const data = snapshot.val();
    console.log(data);
    if (data) {
      hasActiveDelivery.value = true;
      activeDeliveryLocation.value = {
        lat: data.lat,
        lng: data.lng,
      };
      // deliveryLogs.value = data.logs;
    }
  }
);

deliveryLogs.value = [
  {
    message: 'Looking for a driver',
    icon: 'car',
    dateTime: new Date().getTime() - 100000,
  },
  {
    message: 'Driver on the way to store',
    icon: 'check',
    dateTime: new Date().getTime() - 90000,
  },
  {
    message: 'Driver has your order',
    icon: 'check',
    dateTime: new Date().getTime() - 40000,
  },
  {
    message: 'Driver is on the way',
    icon: 'car',
    dateTime: new Date().getTime() - 30000,
  },
  // {
  //   message: 'Driver has arrived!',
  //   icon: 'car',
  //   dateTime: new Date().getTime() - 20,
  // },
];
