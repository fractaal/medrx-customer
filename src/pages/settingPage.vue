<template>

 <q-page class='bg-body'>
  <q-dialog v-model="chlang">
    <q-card class="shadow-2xl rounded-2xl w-96">
      <div class="text-h6 p-4 font-bold">Choose language</div>
      <q-list bordered>

        <q-item clickable v-ripple class="m-2 rounded-xl">
          <q-item-section v-model='locale' @click="locale='en-US'; chlang = false">English</q-item-section>
        </q-item>

        <q-item clickable v-ripple class="m-2 rounded-xl">
          <q-item-section v-model='locale' @click="locale='TGL';chlang = false">Filipino</q-item-section>
        </q-item>

      </q-list>

    </q-card>
  </q-dialog>
  <div>
    <q-img class="top" src="https://cdn.quasar.dev/img/material.png" style="height: 140px">
      <div class="absolute-bottom bg-transparent">

        <q-btn dense flat round >
          <q-avatar color="primary" size="70px" @click="randomizeSeed" class="shadow-xl">
            <img :src="`https://avatars.dicebear.com/api/micah/${seed}.svg`"/>
          </q-avatar>
        </q-btn>

        <div class="text-weight-bold">Oten bwisit</div>
        <div>@bigpipienergy</div>
        
      </div>
    </q-img>      

    <q-list>

      <q-item-label header class="ml-2 text-h6">Profile</q-item-label>

      <q-item-label header class="ml-2 text-h6">User Controls</q-item-label>
        <q-item class="rounded-xl border-2 my-4 p-4 border-gray-200" clickable v-ripple @click="chlang = true">
          <q-item-section>Current Language: {{ locale }} </q-item-section>
        </q-item>

          
        <q-item clickable v-ripple @click="logout">
          <q-item-section>Log Out</q-item-section>
        </q-item>


    </q-list>

    </div>
 </q-page>
</template> 

<script lang="ts">
import { seed, randomizeSeed } from 'src/api/seed'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { getAuth, signOut } from 'firebase/auth';

export default {
  setup () {

    const { locale } = useI18n({ useScope: 'global' })
    const auth = getAuth();

    const logout = async () => {
      await signOut(auth)
    }
    // Sign-out successful.

    return {
      randomizeSeed,
      seed,
      locale,
      localeOptions: [
        { value: 'en-US', label: 'English' },
        { value: 'TGL', label: 'Filipino' }
      ],
      chlang: ref(false),
      logout
    }
  }
}
</script>