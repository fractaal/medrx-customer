<template>
  <q-page>
    <q-item-label class="font-black" overline>IDLE</q-item-label>
    <empty-placeholder icon="help" text="No prescription request selected." />
  </q-page>
</template>

<script lang="ts">
import EmptyPlaceholder from 'src/components/EmptyPlaceholder.vue';
import { defineComponent } from 'vue';
export default defineComponent({
  components: { EmptyPlaceholder },
  name: 'PharmacistView',
});
</script>
