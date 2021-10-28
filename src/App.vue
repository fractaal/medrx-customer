<template>
  <router-view v-slot="{ Component }">
    <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" :duration="150">
      <component :is="Component" />
    </transition>
  </router-view>
</template>
<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, onAuthStateChanged, Auth, User } from 'firebase/auth';

import { init as initFirebase } from 'src/api/firebase';
import { init as initAxios } from 'src/boot/axios';
import { Dialog } from 'quasar';

if (process.env.MODE === 'capacitor') {
  import('src/api/mobile');
}

const getCurrentUser = (auth: Auth) => {
  return new Promise<User | null>((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        resolve(user);
      },
      reject
    );
  });
};

export default defineComponent({
  name: 'App',
  setup() {
    const router = useRouter();

    const desiredPath =
      window.location.hash === '#/' ? null : window.location.hash.substring(1, window.location.hash.length);

    onMounted(async () => {
      await router.push('/');

      let currentUser;

      try {
        await initFirebase();
        currentUser = await getCurrentUser(getAuth());
        await import('src/api/auth');
        await initAxios();
      } catch (err) {
        Dialog.create({
          color: 'red',
          title: 'Failed to connect to MedRx',
          persistent: true,
          message:
            "We couldn't connect to MedRx. Perhaps you're not connected to the internet. Close the app and try again later!",
        });
        return;
      }

      if (desiredPath) {
        console.log(`Going to desired path ${desiredPath}`);
        await router.push(desiredPath);
      } else {
        if (currentUser) {
          console.log('Going to home - user logged in with no specified path');
          router.push('/home');
        } else {
          console.log('Going to login - user not logged in');
          router.push('/login');
        }
      }
    });
  },
});
</script>
