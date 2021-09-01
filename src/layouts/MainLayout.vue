<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-toolbar">
      <q-toolbar>
        <q-btn dense flat round icon='menu' @click="toggleLeftDrawer">
        </q-btn>

        <q-toolbar-title style='text-align:center'>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          
        </q-toolbar-title>

         <q-btn dense flat round @click="toggleRightDrawer">
          <img src='../../public/icons/cart.svg'>
        </q-btn>
      </q-toolbar>
   
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <!-- drawer content -->
    </q-drawer>

    <q-drawer show-if-above v-model="rightDrawerOpen" side="right" bordered>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>

      <router-view/>

    </q-page-container>
    
   <q-footer>
      <q-tabs
            v-model="tab"
            dense
            class="navigation-menu"
          >
            <q-route-tab name="mails" label="Shop" to='/home'>
              <img src='../../public/icons/shop.svg'>
            </q-route-tab>
            <q-route-tab name="alarms" label="Prescription" to='/upload'>
              <img src='../../public/icons/upload.svg'>
            </q-route-tab>
            <q-route-tab name="movies" label="Soon">
              <img src='../../public/icons/soon.svg'>
            </q-route-tab>
          </q-tabs>
    </q-footer>

  </q-layout>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const leftDrawerOpen = ref(false)
    const rightDrawerOpen = ref(false)

    return {
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },

      rightDrawerOpen,
      toggleRightDrawer () {
        rightDrawerOpen.value = !rightDrawerOpen.value
      }
    }
  }
}
</script>

<style scoped>

.bg-toolbar {
  background: #43c9b5;
}

.navigation-menu {
  background: #6ae0ce;
  color: #ffffff;

}

</style>


      