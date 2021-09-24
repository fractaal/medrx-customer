<template>
  <q-layout view="hHh lpR fFf" class="bg-medrx">
    <img src="~assets/cityscape.svg" class="fixed top-4 opacity-10" />
    <q-header unelevated class="text-white bg-transparent">
      <q-toolbar class="px-2 top mx-auto w-full md:w-3/4 lg:w-3/5 py-4">
        <q-btn dense flat v-ripple round class="back" @click="goBack()">
          <q-icon name="chevron_left" size="2rem" />
        </q-btn>
        <q-toolbar-title class="font-bold">{{ $t(`${$route.meta.name}`) }}</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view class="mx-auto w-full md:w-3/4 lg:w-3/5 bg-white rounded-tl-4xl mt-2" />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import mobile from 'src/api/mobile';
import { onBeforeRouteLeave } from 'vue-router';

export default {
  setup() {
    console.log(mobile);
    if (mobile.setStatusBarColor) {
      mobile.setStatusBarColor('#30b59e');
    }

    onBeforeRouteLeave((to, from, next) => {
      if (mobile.goBackToPreviousStatusBarStyle) {
        mobile.goBackToPreviousStatusBarStyle();
      }
      next();
    });

    const goBack = () => {
      window.history.back();
    };
    return {
      goBack,
    };
  },
};
</script>
