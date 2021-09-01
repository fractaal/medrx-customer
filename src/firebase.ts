// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore, setDoc, doc, collection } from 'firebase/firestore'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { Notify } from 'quasar'
import { useRouter } from 'vue-router';

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
  measurementId: 'G-G2Y85HXLNM'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore()
getAnalytics(app);

const router = useRouter();

export const login = async (email: string, password: string) => {
  const auth = getAuth()

  try {
    await signInWithEmailAndPassword(auth, email, password)
    Notify.create('Login successful!')
    router.push('/home')    
  } catch(err) {
    Notify.create(`Failed to log in! ${err}`)
  }
}

export const register = async (email: string, password: string) => {
  const auth = getAuth()
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    setDoc(doc(collection(db, 'users'), userCredential.user.uid), {
      registrationDate: new Date()
    })
    Notify.create('Successfully created an account!')
  } catch(err) {
    Notify.create(`An error occured: ${err}`)
  }
}