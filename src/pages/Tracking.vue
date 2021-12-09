<template>
  <q-page>
    <div>
      <div id="map" ref="mapEl" class="w-full h-96 rounded-none sm:rounded-lg border boder-gray-200" />
    </div>
    <q-item-section class="my-2 relative">
      <div class="absolute top-4 right-4 text-right -space-y-2">
        <p class="font-bold">YOUR DRIVER IS</p>
        <q-skeleton class="bg-transparent before:-mt-8" animation="wave">
          <p class="font-bold text-4xl">2.1km</p>
        </q-skeleton>
        <p class="font-bold">AWAY</p>
      </div>
      <delivery-log
        v-for="(log, i) in deliveryLogs"
        :key="log.dateTime"
        :deliveryLog="log"
        :isActive="i === deliveryLogs.length - 1"
      />
    </q-item-section>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import * as delivery from 'src/api/delivery';
import { formatDistanceToNow } from 'date-fns';

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getDeliveryLocation } from 'src/api/delivery-location';
import DeliveryLog from 'src/components/DeliveryLog.vue';

export default defineComponent({
  components: { DeliveryLog },
  name: 'Tracking',
  setup() {
    const router = useRouter();
    const mapEl = ref<HTMLElement>(null);
    let map: L.Map = null;
    let deliveryLocationMarker: L.Marker = null;

    const fallbackLocation = getDeliveryLocation();
    const location: () => [number, number] = () => [
      delivery.activeDeliveryLocation.value?.lat ?? fallbackLocation.lat,
      delivery.activeDeliveryLocation.value?.lng ?? fallbackLocation.lng,
    ];

    watch(delivery.activeDeliveryLocation, () => {
      if (!deliveryLocationMarker || !delivery.activeDeliveryLocation.value) return;
      map.setView(location());
    });

    watch(mapEl, (newMapEl) => {
      if (!newMapEl) return;
      map = L.map('map').setView(location(), 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
      deliveryLocationMarker = L.marker([
        delivery.activeDeliveryLocation.value?.lat ?? fallbackLocation.lat,
        delivery.activeDeliveryLocation.value?.lng ?? fallbackLocation.lng,
      ])
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

      deliveryLocationMarker.bindPopup('<b>Your delivery location</b><br>').openPopup();
    });

    onMounted(async () => {
      if (!location) {
        console.warn('Unusual state: no location, but the user was on the tracking page');
        await router.push('/home');
      }
    });

    return {
      mapEl,
      ...delivery,
      formatDistanceToNow,
    };
  },
});
</script>
