import { getStorage, ref, uploadBytes, getDownloadURL } from '@firebase/storage';
import { getApp } from '@firebase/app';
import { getAuth } from '@firebase/auth';
import { LocalStorage } from 'quasar';
import { ref as vueRef } from 'vue';
import { seed } from 'src/api/seed';

export const downloadURL = vueRef('');

const storage = getStorage(getApp());
const uploadDir = ref(storage, `users/${getAuth().currentUser?.uid}/profilePicture.png`);

getDownloadURL(uploadDir).then((url) => {
  LocalStorage.set('downloadURL', url ?? null);
});
// LocalStorage.set('downloadURL', getDownloadURL(uploadDir) ?? null);

downloadURL.value = LocalStorage.getItem('downloadURL') ?? `https://avatars.dicebear.com/api/micah/${seed}.svg`;
// get cloud storage reference

export const uploadImage = async (file: File) => {
  await uploadBytes(uploadDir, file);
  const url = await getDownloadURL(uploadDir);
  LocalStorage.set('downloadURL', url);
  downloadURL.value = LocalStorage.getItem('downloadURL') ?? `https://avatars.dicebear.com/api/micah/${seed}.svg`;
};
