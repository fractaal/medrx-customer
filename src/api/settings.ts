import { ref } from 'vue';
import { doc, onSnapshot } from 'firebase/firestore';
import { getAuth } from '@firebase/auth';
import { firestore } from './firebase';

const auth = getAuth();
const uid = auth.currentUser?.uid;
const user = auth.currentUser;

export const firstName = ref('')
export const middleName = ref('')
export const lastName = ref('')
export const phoneNumber = ref('')
export const address = ref('')
export const email = ref('')
export const region = ref('')
export const city = ref('')

onSnapshot(doc(firestore, `users/${uid}`), (doc) => {
  const data = doc.data();
  firstName.value = data!.firstName
  middleName.value = data!.middleName
  lastName.value = data!.lastName
  address.value = data!.address
  region.value = data!.region
  city.value = data!.city
  email.value = data!.email
  if (user!.phoneNumber) {
    phoneNumber.value = user!.phoneNumber;
  }
})