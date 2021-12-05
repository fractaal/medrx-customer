<template>
  <q-page>
    <q-item-label class="text-h6 mb-4 font-black">Tracking</q-item-label>
    <div id="map" ref="mapEl" class="w-full h-96 rounded-none sm:rounded-lg" />
    <q-item-section class="my-2">
      <q-skeleton
        v-for="i in 10"
        :key="i"
        class="p-8"
        :class="i === 10 ? 'bg-gray-300' : 'bg-transparent'"
        style="display: flex"
        :animation="i === 10 ? 'wave' : 'none'"
      >
        <span v-if="i === 10" class="absolute h-6 w-6 rounded-full bg-blue-500 animate-ping duration-75" />
        <span class="absolute h-6 w-6 rounded-full" :class="i === 10 ? 'bg-blue-500' : 'bg-gray-600'" />
        <span class="absolute h-[86px] -mt-8 w-0.5 ml-[11px] z-[-5] bg-gray-300" />
        <p class="ml-12 font-medium">Waiting on a driver</p>
      </q-skeleton>
    </q-item-section>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import { Dialog } from 'quasar';
import CoordinateSelectorDialog from 'src/components/CoordinateSelectorDialog.vue';
import ProductDialog from 'src/components/ProductDialog.vue';
import { getDeliveryLocation } from 'src/api/delivery-location';
import { useRouter } from 'vue-router';

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

export default defineComponent({
  name: 'Tracking',
  setup() {
    const router = useRouter();
    const mapEl = ref<HTMLElement>(null);
    let map: L.Map = null;

    const location = getDeliveryLocation();

    watch(mapEl, (newMapEl) => {
      if (!newMapEl) return;
      map = L.map('map').setView([location.lat, location.lng], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
      const m = L.marker([location.lat, location.lng])
        .addTo(map)
        .setIcon(
          L.icon({
            iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          })
        );

      m.bindPopup('<b>Your delivery location</b><br>').openPopup();
    });

    onMounted(async () => {
      if (!location) {
        console.warn('Unusual state: no location, but the user was on the tracking page');
        await router.push('/home');
      }
    });

    return {
      mapEl,
    };
  },
});
</script>
