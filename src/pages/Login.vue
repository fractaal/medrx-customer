<template>
  <q-page class="p-8">
    <div class="text-6xl font-black mt-32">{{ $t('Welcome') }}</div>
    <div class="p-4">
      <q-input
        v-model="email"
        id="email"
        label="Email"
        type="email"
        placeholder="username@mail.com"
      />
      <q-input v-model="password" id="password" label="Password" type="password" />
      <q-btn color="green" class="mt-4 px-8" @click="signIn()" outline label="Log in" />
      <q-btn color="green" class="mt-4 px-8" to="/register1" outline label="Sign Up" />
      <q-select
        v-model="locale"
        :options="localeOptions"
        label="Language"
        dense
        borderless
        emit-value
        map-options
        options-dense
        style="min-width: 175px"
        class="fixed-top-right px-12"
      />
    </div>
  </q-page>
</template>



<script>
import { defineComponent, ref } from 'vue';
import { login } from 'src/api/firebase';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar';


export default defineComponent({
  name: 'PageIndex',
  setup() {
    const quasar = useQuasar();
    const router = useRouter();
    const email = ref('');
    const password = ref('');

    const signIn = async () => {
      quasar.loading.show()
      await login(email.value, password.value) ? router.push('/home') : null;
      quasar.loading.hide()
    }

    const { locale } = useI18n({ useScope: 'global' })

    return {
      signIn,
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