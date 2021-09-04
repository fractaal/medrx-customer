<template>
  <q-layout view="hHh lpR fFf">

    <q-header unelevated class="px-2 top mx-auto w-full md:w-3/4 lg:w-3/5 py-4">
      <q-toolbar>
        <q-btn dense flat round @click="toggleLeftDrawer">
          <q-avatar color="primary" size="48px" class="shadow-xl">
            <img :src="`https://avatars.dicebear.com/api/micah/${seed}.svg`"/>
          </q-avatar>
        </q-btn>
        <div class="ml-4 text-h6 font-black">Hello, PENIS!</div>

        <q-toolbar-title style="text-align:center">
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          
        </q-toolbar-title>

         <q-btn dense flat round @click="toggleRightDrawer">
          <q-icon name="shopping_cart" size="2rem" class="p-4"/>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer overlay v-model="leftDrawerOpen" side="left">
      <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
          <q-list padding>
            <q-item
              clickable
              v-ripple
              :active="link === 'inbox'"
              @click="$router.push('/settings')"
              active-class="my-menu-link"
            >
            <q-item-section avatar>
              <q-icon name="settings" />
            </q-item-section>

            <q-item-section>Settings</q-item-section>
            </q-item>

          </q-list>
        </q-scroll-area>

        <q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 150px">
          <div class="absolute-bottom bg-transparent">
            <q-btn dense flat round>
              <q-avatar color="primary" size="48px" @click="randomizeSeed" class="shadow-xl">
                <img :src="`https://avatars.dicebear.com/api/micah/${seed}.svg`"/>
              </q-avatar>
            </q-btn>
            <div class="text-weight-bold">Razvan Stoenescu</div>
            <div>@rstoenescu</div>
          </div>
        </q-img>
      </q-drawer>

    <q-page-container>
      <transition
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
        appear
        :duration="300"
      >
        <router-view class="mx-auto w-full md:w-3/4 lg:w-3/5"/>
      </transition>
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

<script lang="ts">
import { ref } from 'vue'
import { seed, randomizeSeed } from 'src/api/seed'

export default {
  setup () {
    const leftDrawerOpen = ref(false)

    return {
      tab: ref('mails'),
      randomizeSeed,
      seed,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },

      toggleRightDrawer () {
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


      