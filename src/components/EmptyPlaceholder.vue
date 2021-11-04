<template>
  <div class="h-full w-full flex flex-col content-center justify-center opacity-50">
    <q-icon :name="icon" size="24px" class="mx-auto" />
    <div class="font-black italic">{{ text }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'EmptyPlaceholder',
  props: {
    icon: {
      type: String,
      default: 'information',
    },
    text: {
      type: String,
    },
  },
});
</script>
