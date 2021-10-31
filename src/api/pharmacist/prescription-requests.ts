import { ref, computed } from 'vue';
import { database } from '../firebase';
import { token } from '../auth';
import * as db from 'firebase/database';
import * as storage from 'firebase/storage';
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

export const prescriptionRequests = ref<Record<string, PrescriptionRequest>>({});
export const numPrescriptionRequests = computed(() => Object.keys(prescriptionRequests.value).length);

db.onValue(db.ref(database, `/${token.value?.claims.region}/${token.value?.claims.city}/`), async (snapshot) => {
  const raw: Record<string, { prescriptionRequests: PrescriptionRequest }> = snapshot.val() ?? {};
  const transformed: Record<string, PrescriptionRequest> = {};

  Object.keys(raw).map((id) => {
    transformed[id] = raw[id].prescriptionRequests;
    transformed[id].userId = id;
  });

  await Promise.all(
    Object.keys(transformed).map(async (id) => {
      transformed[id].photoUrl = await storage.getDownloadURL(
        storage.ref(storage.getStorage(), `/users/${id}/prescription.png`)
      );
    })
  );

  prescriptionRequests.value = transformed;
});

export const returnPrescriptionRequest = async (prescriptionRequestId: string, message: string) => {
  const location = db.ref(
    database,
    `${token.value?.claims.region}/${token.value?.claims.city}/${prescriptionRequestId}/prescriptionRequests`
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

export const restrictUser = async (prescriptionRequestId: string, message: string) => {
  const restrictedUsers = db.ref(database, '/restrictedUsers');
  const location = db.ref(
    database,
    `${token.value?.claims.region}/${token.value?.claims.city}/${prescriptionRequestId}/prescriptionRequests`
  );

  try {
    await db.update(location, { status: PrescriptionRequestStatus.FAILED, customMessage: message ?? null });
    await db.update(restrictedUsers, { [prescriptionRequestId]: true });
  } catch (err) {
    Notify.create({ type: 'negative', message: 'Failed to restrict this user. Please try again!' });
  }
};
