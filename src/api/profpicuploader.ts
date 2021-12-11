
import { getStorage, ref, uploadBytes, getDownloadURL } from '@firebase/storage';
import { getApp } from '@firebase/app';
import { getAuth } from '@firebase/auth';
import { LocalStorage } from 'quasar';
import { ref as vueRef } from 'vue';
import { seed } from 'src/api/seed';


export const downloadURL = vueRef('');

const storage = getStorage(getApp());
const uploadDir = ref(storage, `users/${getAuth().currentUser?.uid}/profilePicture.png`);
LocalStorage.set('downloadURL', getDownloadURL(uploadDir) ?? null);

downloadURL.value = LocalStorage.getItem('downloadURL') ?? `https://avatars.dicebear.com/api/micah/${seed}.svg`;

// get cloud storage reference




export const uploadImage = (file: File) => {

  uploadBytes(uploadDir, file);
  const url = getDownloadURL(uploadDir);
  LocalStorage.set('downloadURL', url);

}







