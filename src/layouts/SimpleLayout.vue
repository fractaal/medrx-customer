<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <transition
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
        appear
        :duration="1000"
      >
        <router-view class="mx-auto w-full md:w-3/4 lg:w-3/5" />
      </transition>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'SimpleLayout'
}
</script>

<style scoped>
</style>


      