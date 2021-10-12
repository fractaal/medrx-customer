import { ref as storageRef, getStorage, getDownloadURL } from 'firebase/storage';
import { ref } from 'vue';

export const placeholderImageUrl = ref('');

(async () => {
  const imgRef = storageRef(getStorage(), '/placeholder.png');
  placeholderImageUrl.value = await getDownloadURL(imgRef);
})();
