import { ref } from 'vue';
import { IdTokenResult, getAuth, onAuthStateChanged } from '@firebase/auth';

export const token = ref<IdTokenResult | null>(null);
const auth = getAuth();

onAuthStateChanged(auth, (user) => {
  if (!user) {
    token.value = null;
    return;
  }

  user.getIdTokenResult().then((t) => (token.value = t));
});
