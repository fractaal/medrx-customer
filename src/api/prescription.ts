import { ref } from 'vue';
import { getAuth, IdTokenResult } from 'firebase/auth';
import { get, set, ref as storageRef, onValue, DatabaseReference } from 'firebase/database';
import { database } from './firebase';
import { Notify, Dialog } from 'quasar';

export enum PrescriptionRequestStatus {
  IN_QUEUE = 'IN_QUEUE',
  IN_PROCESSING = 'IN_PROCESSING',
  FAILED = 'FAILED',
  OK = 'OK',
}

const auth = getAuth();
let token: IdTokenResult | undefined;
let location: DatabaseReference;

export const requestStatus = ref<PrescriptionRequestStatus | undefined>(undefined);
export const customMessage = ref('');

export const performPrescriptionRequest = async () => {
  if (!location) {
    console.warn('Cannot perform prescription request - not initialized!');
    return;
  }
  try {
    await set(location, { __dummy: true });
  } catch (err) {
    requestStatus.value = PrescriptionRequestStatus.FAILED;
    Dialog.create({
      color: 'red',
      persistent: true,
      message:
        'You might be restricted from submitting more prescriptions for a period of time. Check back again later!',
    });
    return;
  }
  requestStatus.value = PrescriptionRequestStatus.IN_QUEUE;
};

(async () => {
  token = await auth.currentUser?.getIdTokenResult();

  if (!token?.claims.region || !token.claims.city) {
    Notify.create({ type: 'negative', message: 'Please log in again.' });
    console.warn('Missing region/city claims in user!');
    return;
  }

  location = storageRef(
    database,
    `/${token.claims.region}/${token.claims.city}/${auth.currentUser?.uid}/prescriptionRequests`
  );

  const existingPrescriptionRequest = (await get(location)).val();

  if (existingPrescriptionRequest.__dummy) {
    requestStatus.value = PrescriptionRequestStatus.IN_QUEUE;
  }

  onValue(location, (snapshot) => {
    const data = snapshot.val();
    const status = data.status;
    const _customMessage = data.customMessage ?? '';
    customMessage.value = _customMessage;
    requestStatus.value = status;
  });
})();
