<template>
  <q-layout view="hHh lpR fFf" class="px-4 md:px-0">
    <img src="~assets/cityscape.svg" class="fixed bottom-4 opacity-5" />
    <q-header unelevated class="text-white bg-primary">
      <q-toolbar class="px-2 top mx-auto w-full md:w-3/4 lg:w-3/5 py-4">
        <q-btn dense flat v-ripple round class="back" @click="$router.back()">
          <q-icon name="chevron_left" size="2rem" />
        </q-btn>
        <q-toolbar-title class="font-bold">{{ $t(`${$route.meta.name}`) }}</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view class="mx-auto w-full md:w-3/4 lg:w-3/5 bg-transparent" />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
export default {
  name: 'HeaderLayout',
};
</script>
