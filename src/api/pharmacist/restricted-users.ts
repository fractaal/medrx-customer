import { ref } from 'vue';
import { Notify } from 'quasar';
import * as db from 'firebase/database';
import { database } from '../firebase';
import { token } from 'src/api/auth';
import { PrescriptionRequestStatus } from 'src/api/prescription';
import { PrescriptionRequest } from './prescription-requests';

interface RestrictedUser {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  restrictedOn: ReturnType<typeof db.serverTimestamp>;
}

export const restrictedUsers = ref<Record<string, RestrictedUser>>({});

const location = db.ref(db.getDatabase(), 'restrictedUsers');

db.onValue(location, (snapshot) => {
  restrictedUsers.value = snapshot.val();
});

export const restrictUser = async (prescriptionRequestId: string, message: string) => {
  const restrictedUsers = db.ref(database, '/restrictedUsers');
  const location = db.ref(
    database,
    `${token.value?.claims.region}/${token.value?.claims.city}/${prescriptionRequestId}/prescriptionRequests`
  );

  const userData: PrescriptionRequest = (await db.get(location)).val();

  try {
    await db.update(location, { status: PrescriptionRequestStatus.FAILED, customMessage: message ?? null });
    await db.update(restrictedUsers, {
      [prescriptionRequestId]: <RestrictedUser>{
        firstName: userData.firstName,
        middleName: userData.middleName,
        lastName: userData.lastName,
        id: userData.userId,
        restrictedOn: db.serverTimestamp(),
      },
    });
  } catch (err) {
    Notify.create({ type: 'negative', message: 'Failed to restrict this user. Please try again!' });
  }
};

// Unrestrict a user:
export const unrestrictUser = async (prescriptionRequestId: string) => {
  const restrictedUsers = db.ref(database, '/restrictedUsers');

  try {
    await db.update(restrictedUsers, { [prescriptionRequestId]: null });
  } catch (err) {
    Notify.create({ type: 'negative', message: 'Failed to unrestrict this user. Please try again!' });
  }
};
