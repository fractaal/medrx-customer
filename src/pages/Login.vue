<template>
  <q-page class="p-8">
    <div class="text-6xl font-black mt-32">{{$t('Welcome')}}</div>
    <div class="p-4">
      <q-input v-model="email" id='email' label="Email" type="email" placeholder="username@mail.com"/>
      <q-input v-model="password" id='password' label="Password" type="password" />
      <q-btn color='green' class="mt-4 px-8" @click='signIn()' outline label="Log in"/>
      <q-btn color='green' class="mt-4 px-8" @click='signUp()' rounded outline label="Sign-up"/>
      <q-select
        v-model="locale"
        :options="localeOptions"
        label="Quasar Language"
        dense
        borderless
        emit-value
        map-options
        options-dense
        style="max-width: 250px"
        class='fixed-bottom px-12' 
      />
    
    </div>
  </q-page>
</template>



<script>
import { defineComponent, ref } from 'vue';
import { login, register } from 'src/api/firebase';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n'


export default defineComponent({
  name: 'PageIndex',
  setup () {
    const router = useRouter();
    const email = ref('');
    const password = ref(''); 
    
    const signIn = async () => await login(email.value, password.value) ? router.push('/home') : null;
    const signUp = async () => await register(email.value, password.value) ? router.push('/home') : null;

    const { locale } = useI18n({ useScope: 'global' })

    return {
      signIn,
      signUp,
      email, 
      password,
      locale,
      localeOptions: [
        { value: 'en-US', label: 'English' },
        { value: 'TGL', label: 'Filipino' }
      ]
    }

    
  },

})

</script>