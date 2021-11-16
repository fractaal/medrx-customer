
import { getStorage, ref, uploadBytes } from "@firebase/storage";
import { getApp } from '@firebase/app';
import { getAuth } from '@firebase/auth';

export const uploadImage = (file: File) => {

  //cloud storage reference
  const storage = getStorage(getApp());
  const uploadDir = ref(storage, `users/${getAuth().currentUser?.uid}/profilePicture.png`);

  uploadBytes(uploadDir, file);

}


