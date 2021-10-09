<template>
  <router-view v-slot="{ Component }">
    <transition
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
      :duration="150"
    >
      <component :is="Component" />
    </transition>
  </router-view>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getAuth } from 'firebase/auth';

import { init as initFirebase } from 'src/api/firebase';
import { init as initAxios } from 'src/boot/axios';

if (process.env.MODE === 'capacitor') {
  import('src/api/mobile');
}

export default defineComponent({
  name: 'App',
  setup() {
    const router = useRouter();
    // const route = useRoute();

    const desiredPath =
      window.location.hash === '#/' ? null : window.location.hash.substring(1, window.location.hash.length);

    onMounted(async () => {
      await router.push('/');
      await initFirebase();
      await new Promise((r) => setTimeout(r, 2500));
      await initAxios();

      if (desiredPath) {
        console.log(`Going to desired path ${desiredPath}`);
        await router.push(desiredPath);
      } else {
        if (getAuth().currentUser) {
          console.log('Going to home - user logged in with no specified path');
          router.push('/home');
        } else {
          console.log('Going to login - user not logged in');
          router.push('/login');
        }
      }
    });

    // getAuth().onAuthStateChanged((user) => {
    //   if (route.path !== '/') return;
    //   if (user) {
    //     router.push('/home');
    //   } else {
    //     router.push('/login');
    //   }
    // });
  },
});
</script>
