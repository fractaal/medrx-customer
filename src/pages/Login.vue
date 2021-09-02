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
import { useRouter } from 'vue-router';


export default defineComponent({
  name: 'PageIndex',
  setup () {
    const router = useRouter();
    const email = ref('');
    const password = ref(''); 
    
    const signIn = async () => await login(email.value, password.value) ? router.push('/home') : null;
    const signUp = async () => await register(email.value, password.value) ? router.push('/home') : null;

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