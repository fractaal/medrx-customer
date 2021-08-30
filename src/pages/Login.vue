<template>
  <q-page class="p-8">
    <div class="text-6xl font-black mt-32">Welcome to MedRx!</div>
    <div class="p-4">
      <q-input v-model="email" label="Email" type="email" placeholder="username@mail.com"/>
      <q-input v-model="password" label="Password" type="password" />
      <q-btn color='green' class="mt-4 px-8" rounded outline label="Log in"/>
      <q-btn color='green' class="mt-4 px-8" rounded outline label="Sign-up"/>
   
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