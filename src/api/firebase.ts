// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore, setDoc, doc, collection, Firestore, serverTimestamp } from 'firebase/firestore';
import { Database, getDatabase } from 'firebase/database';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  browserLocalPersistence,
  signOut,
} from 'firebase/auth';
import { fetchAndActivate, getRemoteConfig } from '@firebase/remote-config';
import { Notify } from 'quasar';
import { init as initAxios } from 'src/boot/axios';
import { FirebaseStorage, getStorage } from '@firebase/storage';
import { setSessionInvalidationFunction } from 'src/boot/axios';
import { routerInstance } from 'src/boot/router';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDnqF9grInCyLpHllHzJaFyhUi7J8XZK08',
  authDomain: 'medrx-test.firebaseapp.com',
  projectId: 'medrx-test',
  storageBucket: 'medrx-test.appspot.com',
  messagingSenderId: '535999064122',
  appId: '1:535999064122:web:06cced6ce33d009b22ed03',
  measurementId: 'G-G2Y85HXLNM',
  databaseUrl: 'https://medrx-test-default-rtdb.asia-southeast1.firebasedatabase.app/',
};

export let app: FirebaseApp;
export let firestore: Firestore;
export let database: Database;
export let storage: FirebaseStorage;

export const init = async () => {
  app = initializeApp(firebaseConfig);
  firestore = getFirestore(app);
  database = getDatabase(app, 'https://medrx-test-default-rtdb.asia-southeast1.firebasedatabase.app/');
  storage = getStorage();
  getAnalytics(app);
  getAuth().setPersistence(browserLocalPersistence);
  if (await fetchAndActivate(getRemoteConfig())) {
    console.log('Remote config fetched and activated');
  } else {
    console.log('Remote config fetch already activated');
  }
};

export const login = async (email: string, password: string) => {
  const auth = getAuth();
  try {
    await signInWithEmailAndPassword(auth, email, password);
    await initAxios();
    Notify.create('Login successful!');
    return true;
  } catch (err) {
    Notify.create(`Failed to log in! ${(err as Error).message}`);
    return false;
  }
};

export const register = async (
  email: string,
  password: string,
  fname: string,
  mname: string,
  lname: string,
  address: string,
  region: string,
  city: string,
) => {
  console.log(region, city);
  const auth = getAuth();
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    await initAxios();
    update(fname, mname, lname, address, region, city);
    Notify.create('Almost there!');
    return true;
  } catch (err) {
    Notify.create(`An error occured: ${(err as Error).message}`);
    return false;
  }
};

export const update = (
  fname: string,
  mname: string,
  lname: string,
  address: string,
  region: string,
  city: string
) => {
  console.log(region, city);
  const auth = getAuth();
  const uid = auth.currentUser?.uid;
  try {
    setDoc(doc(collection(firestore, 'users'), uid), {
      registrationDate: serverTimestamp(),
      firstName: fname,
      middleName: mname,
      lastName: lname,
      address: address,
      region: region,
      city: city,
    });
    return true;
  } catch (err) {
    Notify.create(`An error occured: ${(err as Error).message}`);
    return false;
  }
};

// export const getUser = async () => {
//   const auth = getAuth();

//   try {
//     // For easy access to all user info, store in object each one
//     const userinfo: {
//       email?: string;
//       firstName?: string;
//       middleName?: string;
//       lastName?: string;
//       address?: string;
//       region?: string;
//       city?: string;
//       phoneNumber?: string;
//     } = {};
//     const user = auth.currentUser;

//     if (user !== null) {
//       // TODO: This can be simplified.
//       userinfo.email = user.email!;
//       userinfo.firstName = (await getDoc(doc(collection(firestore, 'users'), user.uid))).data()!.firstName;
//       userinfo.middleName = (await getDoc(doc(collection(firestore, 'users'), user.uid))).data()!.middleName;
//       userinfo.lastName = (await getDoc(doc(collection(firestore, 'users'), user.uid))).data()!.lastName;
//       userinfo.address = (await getDoc(doc(collection(firestore, 'users'), user.uid))).data()!.address;
//       userinfo.region = (await getDoc(doc(collection(firestore, 'users'), user.uid))).data()!.region;
//       userinfo.city = (await getDoc(doc(collection(firestore, 'users'), user.uid))).data()!.city;
//       if (user.phoneNumber) {
//         userinfo.phoneNumber = user.phoneNumber;
//       }
//     }

//     return userinfo;
//   } catch (err) {
//     Notify.create(`An error occured: ${(err as Error).message}`);
//     // return { email: null, name: null };
//   }
// };

setSessionInvalidationFunction(async () => {
  await signOut(getAuth());
  await routerInstance.push('/login');
});

console.log('Firebase app initialized!');
