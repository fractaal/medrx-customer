<template>
  <q-page>
    <div class="text-h4">TRACKING</div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { Dialog } from 'quasar';
import CoordinateSelectorDialog from 'src/components/CoordinateSelectorDialog.vue';
import ProductDialog from 'src/components/ProductDialog.vue';

export default defineComponent({
  name: 'Tracking',
  setup() {
    onMounted(() => {
      setTimeout(() => {
        Dialog.create({
          component: CoordinateSelectorDialog,
          persistent: true,
          componentProps: {
            titleText: 'Select a location',
            descriptionText: 'Tell us where we need to deliver this order.',
            confirmText: 'Deliver here',
            cancelText: 'Prefer not to say',
          },
        });
      }, 1000);
    });
  },
});
</script>
