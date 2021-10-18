import { ref } from 'vue';
import { getAuth, IdTokenResult } from 'firebase/auth';
import { set, ref as storageRef, onValue, DatabaseReference } from 'firebase/database';
import { database } from './firebase';

const auth = getAuth();
let token: IdTokenResult | undefined;
let location: DatabaseReference;

// const location =

export const requestStatus = ref<'success' | 'fail' | 'acknowledged' | undefined>(undefined);

export const performPrescriptionRequest = () => {
  if (!location) {
    console.warn('Cannot perform prescription request - not initialized!');
    return;
  }
  set(location, { __dummy: true });
};

(async () => {
  token = await auth.currentUser?.getIdTokenResult();

  if (!token?.claims.region || !token.claims.city) {
    console.warn('Missing region/city claims in user!');
    return;
  }

  location = storageRef(
    database,
    `/${token.claims.region}/${token.claims.city}/${auth.currentUser?.uid}/prescriptionRequests`
  );

  onValue(location, (snapshot) => {
    const data = snapshot.val();
    const status = data.status;
    requestStatus.value = status;
  });
})();
