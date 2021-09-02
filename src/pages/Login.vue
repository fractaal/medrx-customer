<template>
  <q-page class="p-8">
    <div class="text-6xl font-black mt-32">{{$t('Welcome')}}</div>
    <div class="p-4">
      <q-input v-model="email" id='email' label="Email" type="email" placeholder="username@mail.com"/>
      <q-input v-model="password" id='password' label="Password" type="password" />
      <q-btn color='green' class="mt-4 px-8" @click='signIn()' outline label="Log in"/>
      <q-btn color='green' class="mt-4 px-8" @click='signUp()' rounded outline label="Sign-up"/>
      <q-select 
      class='fixed-bottom px-12' 
      v-model='lang'
      :label="$t('quasarLanguage')" 
      :options="langOptions" 
      style = "max-width:270px"/>
   
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
    

<<<<<<< HEAD
    const signIn = async () => {
      const auth = getAuth()
      
      try {
        await signInWithEmailAndPassword(auth, email.value, password.value)
        Notify.create( 'success' )
        router.push('/home')    
      } catch(err) {
        Notify.create(` yawa ${err}`)
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
=======
    const signIn = () => login(email.value, password.value)
    const signUp = () => register(email.value, password.value)
>>>>>>> 713fe732230a9b38e4bfd5f369afed1d9bc21eb8


    return {
      signIn,
      signUp,
      email, 
      password
    }
  },

  data() {
    return {
      lang: this.$i18n.locale,
      langOptions: [
        { value: 'en-US', label: 'English' },
        { value: 'TGL', label: 'TGL'}
      ]
    }
  },
  watch: {
    lang(lang) {
      this.$i18n.locale = lang
      this.$q.localStorage.set('lang',lang)
    }
  }
})

</script>