<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <transition
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
        appear
        :duration="1000"
      >
        <router-view />
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


      