import { ref } from 'vue';
import { getAuth, IdTokenResult } from 'firebase/auth';
import { set, ref as dbRef, onValue, DatabaseReference, serverTimestamp } from 'firebase/database';
import { database } from './firebase';
import { firstName, middleName, lastName } from './settings';
import { Notify, Dialog } from 'quasar';
import { api } from 'src/boot/axios';
import * as deliveryLocation from 'src/api/delivery-location';

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
      firstName: firstName.value,
      middleName: middleName.value,
      lastName: lastName.value,
      startedAt: serverTimestamp(),
      userId: auth.currentUser?.uid,
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

export const getLatestPrescription = async () => {
  const result = await api.get('/prescription/latest');
  console.log(result);
  return result.data.data;
};

export const confirmLatestPrescription = async () => {
  try {
    const location = await deliveryLocation.getOrPromptForDeliveryLocation();
    console.log(location);
    if (location === null) {
      Notify.create({
        type: 'negative',
        message: "We can't confirm your prescription if you don't have a delivery location set!",
      });
      return;
    }
    const { data } = await api.patch('/prescription/confirm', location);
    console.log('Prescription confirmed - ', data);
  } catch (err) {
    Notify.create({
      type: 'negative',
      message: 'Failed to confirm your prescription. Please try again.',
    });
    console.error(err);
  }
};

export const cancelLatestPrescription = async () => {
  try {
    const { data } = await api.patch('/prescription/cancel');
    console.log('Prescription cancelled - ', data);
  } catch (err) {
    Notify.create({
      type: 'negative',
      message: 'Failed to cancel your prescription. Please try again.',
    });
    console.error(err);
  }
};

(async () => {
  token = await auth.currentUser?.getIdTokenResult();

  if (!token?.claims.region || !token.claims.city) {
    Notify.create({ type: 'negative', message: 'Please log in again.' });
    console.warn('Missing region/city claims in user!');
    return;
  }

  location = dbRef(database, `/${token.claims.region}/${token.claims.city}/${auth.currentUser?.uid}/prescription`);

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
    if (data.status === null || data.status === undefined) {
      requestStatus.value = PrescriptionRequestStatus.IN_QUEUE;
    }
  });
})();
