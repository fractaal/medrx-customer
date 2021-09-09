<template>
  <q-layout view="hHh lpR fFf">
    <q-header unelevated class="px-2 top mx-auto w-full md:w-3/4 lg:w-3/5 py-4">
      <q-toolbar>
        <q-btn dense flat round @click="$router.push('/settings')">
          <q-avatar color="primary" size="48px" class="shadow-xl">
            <img :src="`https://avatars.dicebear.com/api/micah/${seed}.svg`" />
          </q-avatar>
        </q-btn>

        <div class="ml-4 text-h6 font-black">{{ $t('Hello') }} {{ name }}</div>

        <q-space />

        <q-btn dense flat round @click="toggleRightDrawer">
          <q-icon name="shopping_cart" size="2rem" class="p-4" />
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view v-slot="{ Component }" class="mx-auto w-full md:w-3/4 lg:w-3/5">
        <transition
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
          appear
          :duration="150"
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>
    <q-footer>
      <q-tabs v-model="tab">
        <q-route-tab name="mails" label="Shop" to="/home">
          <img src="../../public/icons/shop.svg" />
        </q-route-tab>

        <q-route-tab name="alarms" label="Prescription" to="/upload">
          <img src="../../public/icons/upload.svg" />
        </q-route-tab>

        <!-- <q-route-tab name="movies" label="Soon">
              <img src='../../public/icons/soon.svg'>
        </q-route-tab>-->
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script lang="ts">
import { ref } from 'vue';
import { seed, randomizeSeed } from 'src/api/seed';
import { getUser } from 'src/api/firebase';

export default {
  setup() {

    const name = getUser().name


    return {
      tab: ref('mails'),
      randomizeSeed,
      seed,
      name,
      toggleRightDrawer() {
        // TODO
      }
    }
  }
}
</script>

<style scoped>
.top {
  background-color: white;
  color: black;
}
</style>


      