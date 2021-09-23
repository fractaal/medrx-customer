<template>
  <q-page>
    <!-- Basic details Submission -->
    <div class="mt-20 text-4xl text-center font-black">Sign Up</div>
    <div class="px-10 text-h6 font-bold text-center">Let's get you started for your MedRx account first.</div>
    <q-item-label overline class="px-10 my-4 font-black">PERSONAL INFORMATION</q-item-label>
    <div class="gap-4 px-10 grid-cols-2 grid">
      <div>
        <!-- <div class="mt-5 mb-1 text-sm font-semibold">First Name</div> -->
        <q-input
          v-model="firstName"
          dense
          outlined
          label="First Name"
          placeholder="John"
          lazy-rules
          :rules="firstNameRules"
          class="w-full"
        />
      </div>
      <div>
        <!-- <div class="mt-5 mb-1 text-sm font-semibold">Middle Name (Optional)</div> -->
        <q-input
          v-model="middleName"
          dense
          outlined
          label="Middle Name (Optional)"
          placeholder="Nathan"
          class="w-full"
        />
      </div>
    </div>
    <div class="gap-4 px-10 grid-cols-2 grid">
      <div>
        <!-- <div class="mt-5 mb-1 text-sm font-semibold">Last Name</div> -->
        <q-input
          v-model="lastName"
          dense
          outlined
          label="Last Name"
          placeholder="Doe"
          lazy-rules
          :rules="lastNameRules"
          class="w-full"
        />
      </div>
    </div>
    <q-item-label overline class="px-10 my-4 font-black">CREDENTIALS</q-item-label>
    <div class="px-10">
      <div>
        <!-- <div class="mt-5 mb-1 text-sm font-semibold">E-mail Address</div> -->
        <div>
          <q-input
            v-model="email"
            dense
            outlined
            label="E-mail Address"
            placeholder="address@email.com"
            lazy-rules
            :rules="emailRules"
          />
        </div>
      </div>
      <div>
        <!-- <div class="mt-5 mb-1 text-sm font-semibold">Password</div> -->
        <div>
          <q-input
            v-model="password"
            dense
            outlined
            label="Password"
            placeholder="4_v3ry_s3cvr3_p@ssw0rd"
            :type="isPwd ? 'password' : 'text'"
            lazy-rules
            :rules="passwordRules"
          >
            <template v-slot:append>
              <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
            </template>
          </q-input>
        </div>
      </div>
    </div>
    <q-item-label overline class="px-10 my-4 font-black">GENERAL LOCATION</q-item-label>
    <location-selector class="mb-4" @input="updateLocations" />
    <div align="right" class="px-10">
      <q-btn
        @click="validate()"
        rounded
        unelevated
        color="none"
        label="REGISTER!"
        class="px-8 py-2 font-black bg-gradient-to-tr from-medrx to-green-200"
      />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { register } from 'src/api/firebase';
import LocationSelector from 'src/components/LocationSelector.vue';

export default defineComponent({
  name: 'Register',
  components: { LocationSelector },
  setup() {
    const quasar = useQuasar();
    const router = useRouter();

    // Register form fields
    const email = ref('');
    const password = ref('');
    const firstName = ref('');
    const middleName = ref('');
    const lastName = ref('');
    const locations = ref({ city: '', region: '' });
    const isPwd = ref(true);

    const updateLocations = (val: { city: string; region: string }) => {
      locations.value = { ...val };
    };

    const validate = async () => {
      quasar.loading.show();
      if (
        (email.value, password.value, firstName.value, lastName.value && locations.value.city && locations.value.region)
      ) {
        if (await signUp()) {
          router.push('/verify');
        } else {
          // TODO: Something terrible has happened.
        }
      } else {
        quasar.notify('Please fill up the necessary fields.');
      }
      quasar.loading.hide();
    };

    const signUp = async () => {
      return await register(
        email.value,
        password.value,
        firstName.value,
        middleName.value,
        lastName.value,
        locations.value
      );
    };

    return {
      // Rules
      emailRules: [
        (val: string) =>
          (val && val.length > 0 && val.includes('@') && val.includes('.')) || 'Please enter a valid email address',
      ],
      passwordRules: [(val: string) => (val && val.length > 5) || 'Password must be 6 or more characters long'],
      firstNameRules: [(val: string) => (val && val.length > 0) || 'Please enter your first name'],
      lastNameRules: [(val: string) => (val && val.length > 0) || 'Please enter your last name'],

      // Form fields
      email,
      password,
      firstName,
      middleName,
      lastName,

      // Functions
      validate,
      updateLocations,

      // Plain values
      isPwd,
    };
  },
});
</script>
