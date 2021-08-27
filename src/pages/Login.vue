<template>
  <q-page class="p-8">
    <div class="text-6xl font-black mt-32">Welcome to MedRx!</div>
    <div class="p-4">
      <q-input label="Username"/>
      <q-input label="Password" type="password"/>
      <q-btn class="mt-4 px-8" rounded outline label="Log in"/>
    </div>
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