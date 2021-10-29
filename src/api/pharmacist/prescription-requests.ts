import { ref } from 'vue';
import { database } from '../firebase';
import { token } from '../auth';
import * as db from 'firebase/database';
import * as storage from 'firebase/storage';
import { PrescriptionRequestStatus } from '../prescription';

if (!token.value?.claims.roles.includes('pharmacist')) {
  console.warn(
    'Unauthorized access to the pharmacist prescription requests API - This user does not have "pharmacist" in their roles.'
  );
}

interface PrescriptionRequest {
  status: PrescriptionRequestStatus | undefined;
  customMessage: string | undefined;
  firstName: string;
  middleName: string;
  lastName: string;
  photoUrl: string;
}

export const prescriptionRequests = ref<Record<string, PrescriptionRequest>>({});

db.onValue(db.ref(database, `/${token.value?.claims.region}/${token.value?.claims.city}/`), async (snapshot) => {
  const raw: Record<string, { prescriptionRequests: PrescriptionRequest }> = snapshot.val() ?? {};
  const transformed: Record<string, PrescriptionRequest> = {};

  Object.keys(raw).map((id) => {
    transformed[id] = raw[id].prescriptionRequests;
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
