<template>
  <q-page class='bg-body'>

  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
import { ref } from 'vue';

export default defineComponent({
  name: 'PageIndex',
  setup () {
    return {
      tab: ref('mails')
    }
  }
})


</script>

<style scoped>
.bg-body {
  background: #97f4e6;
}


</style>