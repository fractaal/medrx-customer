import { ref } from 'vue';
import { doc, onSnapshot } from 'firebase/firestore';
import { getAuth } from '@firebase/auth';
import { firestore } from './firebase';
import { Unsubscribe } from '@firebase/util';

const auth = getAuth();

let unsubscribeUserChange: Unsubscribe;

export const firstName = ref('');
export const middleName = ref('');
export const lastName = ref('');
export const phoneNumber = ref('');
export const address = ref('');
export const email = ref('');
export const region = ref('');
export const city = ref('');

auth.onAuthStateChanged((user) => {
  if (user) {
    const uid = user?.uid;
    unsubscribeUserChange = onSnapshot(doc(firestore, `users/${uid}`), (doc) => {
      const data = doc.data();
      console.log('user data changed!', data);
      firstName.value = data.firstName;
      middleName.value = data.middleName;
      lastName.value = data.lastName;
      address.value = data.address;
      region.value = data.region;
      city.value = data.city;
      email.value = data.email;
      if (user.phoneNumber) {
        phoneNumber.value = user.phoneNumber;
      }
    });
  } else {
    // There is no more user -- the onSnapshot callback should be unsubscribed.
    unsubscribeUserChange();
  }
});
