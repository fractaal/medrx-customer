<template>
  <q-page class="p-8">
    <div class="text-6xl font-black mt-32">{{ $t('welcome') }}</div>
    <div class="p-4">
      <q-input v-model="email" id="email" label="Email" type="email" placeholder="username@mail.com" />
      <q-input v-model="password" id="password" label="Password" type="password" />
      <q-btn
        text-color="white"
        unelevated
        class="mt-4 px-8 py-2 font-black bg-gradient-to-tr from-medrx to-green-200"
        rounded
        @click="signIn()"
        label="Log in"
      />
      <!-- <q-btn color="green" class="mt-4 px-8" to="/register1" outline label="Sign Up" /> -->
      <q-footer class="p-4 flex justify-between" color="white">
        <p class="m-0 p-0">
          {{ $t('none') }}
          <q-btn class="p-0 -mt-1" padding="none" dense flat no-caps to="/register" outline>Sign up!</q-btn>
        </p>
        <q-btn flat round @click="chlang = true">
          <q-dialog v-model="chlang">
            <q-card>
              <q-list bordered separator>
                <q-item clickable v-ripple>
                  <q-item-section
                    v-model="locale"
                    @click="
                      locale = 'TGL';
                      chlang = false;
                    "
                    >Filipino</q-item-section
                  >
                </q-item>
                <q-item clickable v-ripple>
                  <q-item-section
                    v-model="locale"
                    @click="
                      locale = 'en-US';
                      chlang = false;
                    "
                    >English</q-item-section
                  >
                </q-item>
              </q-list>
            </q-card>
          </q-dialog>

          <q-icon name="language" size="1.5rem">
            <q-tooltip>{{ $t('language') }}</q-tooltip>
          </q-icon>
        </q-btn>
      </q-footer>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { login } from 'src/api/firebase';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'PageIndex',
  setup() {
    const quasar = useQuasar();
    const router = useRouter();
    const email = ref('');
    const password = ref('');

    const signIn = async () => {
      quasar.loading.show();
      (await login(email.value, password.value)) ? router.push('/home') : null;
      quasar.loading.hide();
    };

    const { locale } = useI18n({ useScope: 'global' });

    return {
      signIn,
      email,
      password,
      locale,
      chlang: ref(false),
      localeOptions: [
        { value: 'en-US', label: 'English' },
        { value: 'TGL', label: 'Filipino' },
      ],
    };
  },
});
</script>
