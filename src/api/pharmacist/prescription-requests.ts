import { ref, computed } from 'vue';
import { database } from '../firebase';
import { token } from '../auth';
import * as db from 'firebase/database';
import * as storage from 'firebase/storage';
import * as auth from 'firebase/auth';
import { PrescriptionRequestStatus } from '../prescription';
import { Notify } from 'quasar';

if (!token.value?.claims.roles.includes('pharmacist')) {
  console.warn(
    'Unauthorized access to the pharmacist prescription requests API - This user does not have "pharmacist" in their roles.'
  );
}

export interface PrescriptionRequest {
  status: PrescriptionRequestStatus | undefined;
  customMessage: string | undefined;
  firstName: string;
  middleName: string;
  lastName: string;
  photoUrl: string;
  userId: string;
  startedAt: string;
  [x: string]: any;
}

export const isLoading = ref(true);
export const prescriptionRequests = ref<Record<string, PrescriptionRequest>>({});
export const numPrescriptionRequests = computed(() => Object.keys(prescriptionRequests.value).length);

const updatePrescriptionRequests = async (data: db.DataSnapshot) => {
  const raw: Record<string, { prescription: PrescriptionRequest }> = data.val() ?? {};
  const transformed: Record<string, PrescriptionRequest> = {};

  Object.keys(raw).map((id) => {
    // Only put in transformed if prescription request is does not have FAILED status:
    if (!raw[id].prescription) return;
    if (raw[id].prescription.status !== 'FAILED') {
      transformed[id] = raw[id].prescription;
      transformed[id].userId = id;
    }
  });

  await Promise.all(
    Object.keys(transformed).map(async (id) => {
      transformed[id].photoUrl = await storage.getDownloadURL(
        storage.ref(storage.getStorage(), `/users/${id}/prescription.png`)
      );
    })
  );

  prescriptionRequests.value = transformed;
};

db.get(db.ref(database, `/${token.value?.claims.region}/${token.value?.claims.city}/`)).then(async (data) => {
  await updatePrescriptionRequests(data);
  isLoading.value = false;
});

db.onValue(db.ref(database, `/${token.value?.claims.region}/${token.value?.claims.city}/`), updatePrescriptionRequests);

export const claimPrescriptionRequest = async (prescriptionRequestId: string) => {
  const location = db.ref(
    database,
    `/${token.value?.claims.region}/${token.value?.claims.city}/${prescriptionRequestId}/prescription`
  );

  await db.update(location, {
    claimed: true,
    claimedBy: auth.getAuth().currentUser?.uid,
    status: PrescriptionRequestStatus.IN_PROCESSING,
  });
};

export const returnPrescriptionRequest = async (prescriptionRequestId: string, message: string) => {
  const location = db.ref(
    database,
    `${token.value?.claims.region}/${token.value?.claims.city}/${prescriptionRequestId}/prescription`
  );
  try {
    await db.update(location, {
      status: PrescriptionRequestStatus.FAILED,
      customMessage: message ?? null,
    } as Partial<PrescriptionRequest>);
  } catch (err) {
    Notify.create({ type: 'negative', message: 'Failed to return this prescription request. Please try again!' });
  }
};

export const getPrescriptionRequest = async (prescriptionRequestId: string) => {
  const location = db.ref(
    database,
    `${token.value?.claims.region}/${token.value?.claims.city}/${prescriptionRequestId}/prescription`
  );
  try {
    const prescriptionRequest: PrescriptionRequest = (await db.get(location)).val() ?? {};
    prescriptionRequest.userId = prescriptionRequestId;
    prescriptionRequest.photoUrl = await storage.getDownloadURL(
      storage.ref(storage.getStorage(), `/users/${prescriptionRequestId}/prescription.png`)
    );
    return prescriptionRequest;
  } catch (err) {
    Notify.create({ type: 'negative', message: 'Failed to get this prescription request. Please try again!' });
    return null;
  }
};
