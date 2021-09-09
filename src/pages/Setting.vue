<template>
  <q-page class="bg-body">
    <div>
      <q-img class="top" src="https://cdn.quasar.dev/img/material.png" style="height: 130px">
        <div class="absolute-bottom bg-transparent">
          <q-btn round dense flat>
            <q-avatar color="primary" size="70px" @click="randomizeSeed" class="shadow-xl">
              <img :src="`https://avatars.dicebear.com/api/micah/${seed}.svg`" />
            </q-avatar>
          </q-btn>

          <div class="text-weight-bold">{{ email }}</div>
        </div>
      </q-img>

      <q-list bordered separator>
        <q-item-label header>Profile</q-item-label>

        <q-item-label header>User Controls</q-item-label>
        <q-item clickable @click="chlang = true">
          <q-item-section>Current Language: {{ locale }}</q-item-section>
        </q-item>

        <q-dialog v-model="chlang">
          <q-card>
            <q-list bordered separator>
              <q-item clickable v-ripple>
                <q-item-section v-model="locale" @click="locale = 'TGL'; chlang = false">Filipino</q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </q-dialog>

        <q-item clickable v-ripple @click="confirm = true">
          <q-item-section>Log-out</q-item-section>
        </q-item>

        <q-dialog v-model="confirm" persistent>
          <q-card>
            <q-list bordered separator>
              <q-card-section class="row items-center">
                <q-avatar icon="warning" color="primary" text-color="white" />
                <span class="q-ml-sm">Are you sure you want to log-out?</span>
              </q-card-section>

              <q-card-actions>
                <q-btn flat label="No" color="primary" style="width: 150px" v-close-popup />
                <q-btn
                  flat
                  label="Yes"
                  color="primary"
                  style="width: 150px"
                  v-close-popup
                  @click="logout"
                />
              </q-card-actions>
            </q-list>
          </q-card>
        </q-dialog>
      </q-list>
    </div>
  </q-page>
</template> 

<script lang="ts">
import { seed, randomizeSeed } from 'src/api/seed'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { getAuth, signOut } from 'firebase/auth';
import { getUser } from 'src/api/firebase';

export default {
  setup() {

    const { locale } = useI18n({ useScope: 'global' })
    const auth = getAuth();
    const email = getUser().email;
    const logout = async () => {
      await signOut(auth)
    }
    // Sign-out successful.

    return {
      randomizeSeed,
      seed,
      locale,
      email,
      chlang: ref(false),
      confirm: ref(false),
      logout
    }
  }
}
</script>