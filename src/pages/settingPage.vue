<template>

 <q-page class='bg-body'>
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


      <q-list bordered separator>

        <q-item-label header>Profile</q-item-label>

        <q-item-label header>User Controls</q-item-label>
          <q-item clickable v-ripple @click="chlang = true">
            <q-item-section>Current Language: {{ locale }} </q-item-section>
          </q-item>

            <q-dialog v-model="chlang">
              <q-card>
                <q-list bordered separator>

                  <q-item clickable v-ripple style="min-width: 300px">
                    <q-item-section v-model='locale' @click="locale='en-US'; chlang = false">English</q-item-section>
                  </q-item>

                  <q-item clickable v-ripple>
                    <q-item-section v-model='locale' @click="locale='TGL';chlang = false">Filipino</q-item-section>
                  </q-item>

                </q-list>

              </q-card>
            </q-dialog>
            
          <q-item clickable v-ripple @click="logout">
            <q-item-section>Log-out</q-item-section>
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