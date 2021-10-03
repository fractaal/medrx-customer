<template>
  <div>
    <div id="map" style="width: 300px; height: 300px"></div>
  </div>
</template>

<script lang="ts">
import 'leaflet/dist/leaflet.css';
import { defineComponent, onMounted } from 'vue';
import L from 'leaflet';

export default defineComponent({
  name: 'GeolocationTest',
  setup() {
    onMounted(() => {
      const map = L.map('map').setView([51.505, -0.09], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      const m = L.marker([51.5, -0.09])
        .addTo(map)
        .setIcon(
          L.icon({
            iconUrl:
              'https://yt3.ggpht.com/ytc/AKedOLSZxjVzsvk2KldSXm0lsCTPbWg_CdhLSCqfCrmhuA=s48-c-k-c0x00ffffff-no-rj',
          })
        )
        .bindPopup('Driver')
        .openPopup();

      let i = 0;
      setInterval(() => {
        m.setLatLng([51.5 + ++i / 1000, -0.09]);
      }, 1000);
    });
  },
});
</script>
