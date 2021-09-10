<template>
  <q-page>
    <div>
      <q-img class="top rounded-b-2xl" src="https://64.media.tumblr.com/85ac3c19f74c65386969162b12e24f46/tumblr_inline_o29dnbbdq41rtb73a_1280.jpg" style="height: 130px">
        <div class="absolute-bottom bg-transparent">
          <q-btn round dense flat>
            <q-avatar color="primary" size="70px" @click="randomizeSeed" class="shadow-xl">
              <q-img :src="`https://avatars.dicebear.com/api/micah/${seed}.svg`" />
            </q-avatar>
          </q-btn>

          <div class="text-weight-bold">{{ email }}</div>
        </div>
      </q-img>

      <q-list>
        <q-item-label header overline class="font-black">PROFILE</q-item-label>

        <list-item color="primary" name="person" size="2rem">
          Profile Picture
        </list-item>        

        <list-item color="primary" name="badge" size="2rem">
          Name
        </list-item>        

        <list-item color="primary" name="call" size="2rem">
          Phone Numbers
        </list-item>

        <list-item color="primary" name="home" size="2rem">
          Delivery Addresses
        </list-item>

        <q-item-label header overline class="font-black">USER CONTROLS</q-item-label>

        <list-item @click="chlang = true" color="primary" name="language" size="2rem">
          Current Language: {{ locale }}
        </list-item>

        <q-dialog v-model="chlang">
          <q-card>
            <q-list bordered separator>
              <q-item clickable v-ripple>
                <q-item-section v-model="locale" @click="locale = 'TGL'; chlang = false">Filipino</q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </q-dialog>

        <list-item @click="confirm = true" color="primary" name="logout" size="2rem">
          Log Out
        </list-item>

        <q-dialog v-model="confirm" persistent>
          <q-card>
            <q-list>
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

import ListItem from 'src/components/ListItem.vue';

export default {
  components: { ListItem },
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