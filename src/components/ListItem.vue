<template>
  <q-item clickable class="p-4 mb-4 rounded-xl border-green-50 border-2 font-medium">
    <q-item-section avatar>
      <q-icon v-bind="$attrs"/>
    </q-item-section>
    <q-item-section>
      <slot/>
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ListItem'
})
</script>