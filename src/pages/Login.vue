<template>
  <q-page class="p-8">
    <div class="text-6xl font-black mt-32">Welcome to MedRx!</div>
    <div class="p-4">
      <q-input v-model="email" id='email' label="Email" type="email" placeholder="username@mail.com"/>
      <q-input v-model="password" id='password' label="Password" type="password" />
      <q-btn color='green' class="mt-4 px-8" @click='signIn()' outline label="Log in"/>
      <q-btn color='green' class="mt-4 px-8" @click='signUp()' rounded outline label="Sign-up"/>
      
   
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { login, register } from 'src/firebase';

export default defineComponent({
  name: 'PageIndex',
  setup () {
    const email = ref('');
    const password = ref(''); 

    const signIn = () => login(email.value, password.value)
    const signUp = () => register(email.value, password.value)

    return {
      signIn,
      signUp,
      email, 
      password
    }
  }
})

</script>