<template>
  <q-item clickable class="p-4 rounded-xl border border-gray-200">
    <q-item-section>
      <slot />
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ListItem'
})
</script>