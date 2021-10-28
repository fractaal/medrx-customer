import { ref } from 'vue';
import { database } from '../firebase';
import { token } from '../auth';
import * as db from 'firebase/database';
import { PrescriptionRequestStatus } from '../prescription';

interface PrescriptionRequest {
  status: PrescriptionRequestStatus | undefined;
  customMessage: string | undefined;
  firstName: string;
  middleName: string;
  lastName: string;
  photoUrl: string;
}

export const prescriptionRequests = ref<Record<string, PrescriptionRequest>>({});

db.onValue(db.ref(database, `/${token.value?.claims.region}/${token.value?.claims.city}/`), (snapshot) => {
  const raw: Record<string, { prescriptionRequests: PrescriptionRequest }> = snapshot.val() ?? {};
  const transformed: Record<string, PrescriptionRequest> = {};

  Object.keys(raw).map((id) => {
    transformed[id] = raw[id].prescriptionRequests;
  });

  prescriptionRequests.value = transformed;
});
