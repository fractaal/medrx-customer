<template>
  <q-item clickable v-ripple style="min-width: 300px">
    <q-item-section v-model="locale" @click="locale = 'en-US'; chlang = false">English</q-item-section>
  </q-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'ListItem',
  setup() {
    const { locale } = useI18n({ useScope: 'global' })
    return {
      locale
    }
  }
})
</script>