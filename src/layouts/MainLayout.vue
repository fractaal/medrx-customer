<template>
  <q-layout view="hHh lpR fFf">
    <!-- <img src="~assets/cityscape.svg" class="fixed bottom-4 opacity-5" /> -->
    <img src="~assets/cityscape.svg" class="fixed bottom-4 opacity-5" />
    <q-header unelevated class="px-2 top mx-auto w-full md:w-3/4 lg:w-3/5 py-2">
      <q-toolbar>
        <div>
          <q-btn
            dense
            flat
            round
            icon="chevron_left"
            size="lg"
            v-if="$route.path !== '/home'"
            class="-ml-14 mr-2"
            @click="$router.back()"
          />
          <q-btn dense flat round @click="$router.push('/settings')">
            <q-avatar color="primary" size="40px" class="shadow-xl">
              <q-img :src="`https://avatars.dicebear.com/api/micah/${seed}.svg`" />
            </q-avatar>
          </q-btn>
        </div>

        <!-- <div class="ml-4 text-h6 font-black">{{ $t('hello') }}, {{ firstName }}!</div> -->

        <!-- <q-space /> -->
        <q-input
          dense
          flat
          outlined
          rounded
          label="Search..."
          to="/search"
          class="mx-4 w-full"
          v-model="searchTerm"
          @click="$router.push('/search')"
        >
          <template v-slot:append>
            <q-icon name="search" size="sm" />
          </template>
        </q-input>
        <!-- <q-btn dense flat round icon="search" to="/search" /> -->
      </q-toolbar>
    </q-header>
    <q-page-container class="my-2">
      <router-view v-slot="{ Component }" class="mx-auto w-full md:w-3/4 lg:w-3/5">
        <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" appear :duration="150">
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>
    <q-footer class="bg-white text-black">
      <q-tabs v-model="tab" :breakpoint="300">
        <q-route-tab to="/cart">
          <q-icon size="sm" name="shopping_cart">
            <q-badge v-if="itemsInCart != 0" color="primary">{{ itemsInCart }}</q-badge>
          </q-icon>
          <p class="text-xs font-black">CART</p>
        </q-route-tab>

        <q-route-tab to="/home">
          <q-icon name="shopping_basket" size="sm" />
          <p class="text-xs font-black">SHOP</p>
        </q-route-tab>

        <q-route-tab to="/upload">
          <q-icon name="medication" size="sm" />
          <p class="text-xs font-black">PRESCRIBE</p>
        </q-route-tab>

        <!-- <q-route-tab name="movies" label="Soon">
              <img src='../../public/icons/soon.svg'>
        </q-route-tab>-->
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import { seed, randomizeSeed } from 'src/api/seed';
import { getUser } from 'src/api/firebase';
import { itemsInCart } from 'src/api/cart';
import { searchTerm } from 'src/api/search';

export default {
  setup() {
    const firstName = ref('');

    // TODO: Take SQL number of cart items. (Only General Items, medicine not included)

    onMounted(async () => {
      firstName.value = (await getUser())?.firstName as string;
    });

    return {
      tab: ref('mails'),
      randomizeSeed,
      seed,
      firstName,
      itemsInCart,

      searchTerm,
    };
  },
};
</script>

<style scoped>
.top {
  background-color: white;
  color: black;
}
</style>
