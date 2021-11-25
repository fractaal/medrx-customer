import { ref } from 'vue';
import * as db from 'firebase/database';
import { token } from './auth';
import { database } from './firebase';
import { getAuth } from 'firebase/auth';

export const hasActiveDelivery = ref(false);

db.onValue(
  db.ref(database, `${token.value.claims.region}/${token.value.claims.city}/${getAuth().currentUser.uid}/deliveries`),
  (snapshot) => {
    const data = snapshot.val();
    console.log(data);
    if (data) {
      hasActiveDelivery.value = true;
    }
  }
);
