<template>
  <router-view v-slot="{ Component }">
    <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" :duration="150">
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
    initFirebase().then(() => initAxios());

    const router = useRouter();
    const route = useRoute();

    getAuth().onAuthStateChanged((user) => {
      if (route.path !== '/') return;

      if (user) {
        router.push('/home');
      } else {
        router.push('/login');
      }
    });
  },
});
</script>
