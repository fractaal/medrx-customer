import { ref } from 'vue';
import { getAuth, IdTokenResult } from 'firebase/auth';
import { set, ref as dbRef, onValue, DatabaseReference, serverTimestamp } from 'firebase/database';
import { database } from './firebase';
import { firstName, middleName, lastName } from './settings';
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
    await set(location, {
      __dummy: true,
      firstName: firstName.value,
      middleName: middleName.value,
      lastName: lastName.value,
      startedAt: serverTimestamp(),
    });
  } catch (err) {
    // requestStatus.value = PrescriptionRequestStatus.FAILED;
    console.log(err);
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

export const revokePrescriptionRequest = () => {
  const revoke = async () => {
    try {
      await set(location, null);
    } catch (err) {
      Dialog.create({
        color: 'red',
        persistent: true,
        message:
          'You might be restricted from interacting with prescriptions for a period of time. Check back again later!',
      });
    }
  };

  Dialog.create({
    color: 'red',
    title: 'Are you sure?',
    message: "You'll be removing this prescription from being transcribed or saved.",
    cancel: true,
    focus: 'cancel',
  }).onOk(revoke);
};

(async () => {
  token = await auth.currentUser?.getIdTokenResult();

  if (!token?.claims.region || !token.claims.city) {
    Notify.create({ type: 'negative', message: 'Please log in again.' });
    console.warn('Missing region/city claims in user!');
    return;
  }

  location = dbRef(
    database,
    `/${token.claims.region}/${token.claims.city}/${auth.currentUser?.uid}/prescriptionRequests`
  );

  onValue(location, (snapshot) => {
    const data = snapshot.val();

    console.log(data);

    if (!data) {
      requestStatus.value = undefined;
      return;
    }

    const status = data.status;
    const _customMessage = data.customMessage ?? '';
    customMessage.value = _customMessage;
    requestStatus.value = status;
    if (data.__dummy && data.status === null) {
      requestStatus.value = PrescriptionRequestStatus.IN_QUEUE;
    }
  });
})();
