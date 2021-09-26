<template>
  <q-page>
    <div>
      <q-img
        class="top rounded-b-2xl"
        src="https://64.media.tumblr.com/85ac3c19f74c65386969162b12e24f46/tumblr_inline_o29dnbbdq41rtb73a_1280.jpg"
        style="height: 130px"
      >
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

        <list-item color="primary" name="person" size="2rem">Profile Picture</list-item>

        <list-item @click="namechange = true" color="primary" name="badge" size="2rem">Name</list-item>

        <q-dialog v-model="namechange" persistent>
          <q-card style="min-width: 350px">
            <q-card-section>
              <div class="text-h6">Change your name:</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-input dense v-model="firstName" autofocus label="First Name" />
              <q-input dense v-model="middleName" autofocus label="Middle Name" />
              <q-input dense v-model="lastName" autofocus label="Last Name" />
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
              <q-btn flat label="Cancel" v-close-popup />
              <q-btn flat label="Update" v-close-popup @click="updateName()" />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <list-item color="primary" name="call" size="2rem">Phone Number</list-item>

        <list-item color="primary" name="home" size="2rem">Delivery Addresses</list-item>

        <q-item-label header overline class="font-black">USER CONTROLS</q-item-label>

        <list-item
          @click="chlang = true"
          color="primary"
          name="language"
          size="2rem"
        >Current Language: {{ locale }}</list-item>

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
                >Filipino</q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </q-dialog>

        <list-item @click="confirm = true" color="primary" name="logout" size="2rem">Log Out</list-item>

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
import { seed, randomizeSeed } from 'src/api/seed';
import { useI18n } from 'vue-i18n';
import { ref, onMounted } from 'vue';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'vue-router';
import { getUser, update } from 'src/api/firebase';



import ListItem from 'src/components/ListItem.vue';

export default {
  components: { ListItem },
  setup() {
    const router = useRouter();
    const { locale } = useI18n({ useScope: 'global' });
    const auth = getAuth();
    const email = auth.currentUser?.email;

    //get User data
    const firstName = ref('');
    const middleName = ref('');
    const lastName = ref('');
    const locations = ref({ city: '', region: '' });

    onMounted(async () => {
      firstName.value = (await getUser())?.firstName as string;
      middleName.value = (await getUser())?.middleName as string;
      lastName.value = (await getUser())?.lastName as string;
      locations.value.region = (await getUser())?.region as string;
      locations.value.city = (await getUser())?.city as string;
    });

    const updateName = () => {
      update(firstName.value, middleName.value, lastName.value, locations.value)
    }


    const logout = async () => {
      await signOut(auth);
      router.push('/login');
    };
    // Sign-out successful.

    return {
      randomizeSeed,
      seed,
      locale,
      email,
      chlang: ref(false),
      confirm: ref(false),
      namechange: ref(false),
      firstName,
      middleName,
      lastName,
      logout,
      updateName

    };
  },
};
</script>
