<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card style="max-width: 100vw">
      <q-card-section>
        <div class="text-h6">{{ titleText }}</div>
        <p>{{ descriptionText }}</p>
        <div ref="mapEl" id="map" class="h-[60vh] w-[calc(100vw-100px)] md:w-96 rounded-lg border border-medrx" />
        <div class="w-full flex mt-2">
          <q-btn outline color="red" class="block" unelevated dense @click="onCancelClick">{{ cancelText }}</q-btn>
          <q-btn
            class="block ml-auto from-medrx to-green-200 bg-gradient-to-tr text-white shadow-lg"
            unelevated
            dense
            @click="onOKClick"
            >{{ confirmText }}</q-btn
          >
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import { useDialogPluginComponent } from 'quasar';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Location } from 'src/api/delivery-location';

export default defineComponent({
  name: 'CoordinateSelectorDialog',
  props: {
    titleText: {
      type: String,
      default: 'Select a location',
    },
    descriptionText: {
      type: String,
      default: '',
    },
    confirmText: {
      type: String,
      default: 'Select this location',
    },
    cancelText: {
      type: String,
      default: 'Cancel',
    },
    initialCoordinates: {
      type: Object as () => Location,
      default: () => ({
        lat: 8.5,
        lng: 124,
      }),
    },
  },
  setup(props) {
    // REQUIRED; must be called inside of setup()
    const mapEl = ref<HTMLElement>(null);
    let map: L.Map = null;
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();
    // dialogRef      - Vue ref to be applied to QDialog
    // onDialogHide   - Function to be used as handler for @hide on QDialog
    // onDialogOK     - Function to call to settle dialog with "ok" outcome
    //                    example: onDialogOK() - no payload
    //                    example: onDialogOK({ /*.../* }) - with payload
    // onDialogCancel - Function to call to settle dialog with "cancel" outcome

    watch(mapEl, (newMapEl) => {
      if (!newMapEl) return;
      map = L.map('map').setView([props.initialCoordinates.lat, props.initialCoordinates.lng], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
      const m = L.marker([props.initialCoordinates.lat, props.initialCoordinates.lng])
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

      map.on('move', () => m.setLatLng(map.getCenter()));
      map.on('zoomanim', () => m.setLatLng(map.getCenter()));
    });

    return {
      mapEl,
      // This is REQUIRED;
      // Need to inject these (from useDialogPluginComponent() call)
      // into the vue scope for the vue html template
      dialogRef,
      onDialogHide,

      // other methods that we used in our vue html template;
      // these are part of our example (so not required)
      onOKClick() {
        const coords = map.getCenter();
        console.log(coords);
        onDialogOK({
          lat: coords.lat,
          lng: coords.lng,
        });
        // on OK, it is REQUIRED to
        // call onDialogOK (with optional payload)
        // or with payload: onDialogOK({ ... })
        // ...and it will also hide the dialog automatically
      },

      // we can passthrough onDialogCancel directly
      onCancelClick: onDialogCancel,
    };
  },
});
</script>
