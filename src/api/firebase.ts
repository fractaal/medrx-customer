// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore, setDoc, doc, collection, Firestore } from 'firebase/firestore'
import { Database, getDatabase } from 'firebase/database'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, browserLocalPersistence } from 'firebase/auth';
import { Notify } from 'quasar'

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
  databaseUrl: 'https://medrx-test-default-rtdb.asia-southeast1.firebasedatabase.app/'
};

export let app: FirebaseApp
export let firestore: Firestore
export let database: Database

export const init = () => {
  app = initializeApp(firebaseConfig);
  firestore = getFirestore(app)
  database = getDatabase(app, 'https://medrx-test-default-rtdb.asia-southeast1.firebasedatabase.app/')
  getAnalytics(app);
  getAuth().setPersistence(browserLocalPersistence)
}

export const login = async (email: string, password: string) => {
  const auth = getAuth()
  try {
    await signInWithEmailAndPassword(auth, email, password)
    Notify.create('Login successful!')
    return true
  } catch(err) {
    Notify.create(`Failed to log in! ${err}`)
    return false
  }
}

export const register = async (email: string, password: string) => {
  const auth = getAuth()
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    setDoc(doc(collection(firestore, 'users'), userCredential.user.uid), {
      registrationDate: new Date()
    })
    Notify.create('Successfully created an account!')
    return true
  } catch(err) {
    Notify.create(`An error occured: ${err}`)
    return false
  }
}

console.log('Firebase app initialized!')