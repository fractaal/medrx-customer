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
import { } from 'src/firebase.ts';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword} from 'firebase/auth';
import { Notify } from 'quasar';


export default defineComponent({
  name: 'PageIndex',
  setup () {
    const email = ref('');
    const password = ref(''); 

    const signIn = async () => {
      const auth = getAuth()
      try {
        await signInWithEmailAndPassword(auth, email.value, password.value)
        Notify.create('Login successful!')
      } catch(err) {
        Notify.create(`Failed to log in! ${err}`)
      }
    }

    const signUp = async () => {
      const auth = getAuth()
      try {
        await createUserWithEmailAndPassword(auth, email.value, password.value)
        Notify.create('Successfully created an account!')
      } catch(err) {
        Notify.create(`An error occured: ${err}`)
      }
    }



    return {
      signIn,
      signUp,
      email, 
      password
    }
  }
})


</script>