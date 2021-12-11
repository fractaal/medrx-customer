<template>
  <q-page>
    <transition name="fade" mode="out-in">
      <firebase-uploader
        v-if="requestStatus === undefined"
        color="bg-uploadheader"
        class="fixed-center shadow-xl"
        style="max-width: 500px"
        label="Upload your prescription here."
        accept=".jpg, image/*"
        :max-file-size="1024 * 1024 * 2.5"
        @uploaded="performPrescriptionRequest"
      />
      <div v-else class="text-center flex content-center justify-center flex-col" style="height: calc(100vh - 200px)">
        <transition name="fade" mode="out-in">
          <div v-if="requestStatus === 'IN_QUEUE'">
            <q-spinner class="mx-auto" size="128px" :thickness="3" />
            <p class="text-h4 font-black">Give us a second...</p>
            <p class="font-black">Your prescription is in the system queue.</p>
          </div>
          <div v-else-if="requestStatus === 'IN_PROCESSING'">
            <q-spinner-pie class="mx-auto" size="128px" :thickness="3" />
            <p class="text-h4 font-black">Almost there...</p>
            <p class="font-black">Our system is currently analyzing your prescription!</p>
          </div>
          <div v-else-if="requestStatus === 'FAILED'">
            <q-icon size="128px" name="cancel" />
            <p class="text-h4 font-black">Whoops...</p>
            <p class="font-black">Something went wrong with analyzing your prescription.</p>
          </div>
          <div v-else-if="requestStatus === 'OK'">
            <q-icon size="128px" name="check_circle" />
            <p class="text-h4 font-black">Awesome!</p>
            <p class="font-black">
              Prescription successfully analyzed!
              <br />You should now check if the analyzed prescription is correct.
            </p>
            <br />
            <q-btn
              class="py-4 px-8 bg-gradient-to-tr from-medrx to-green-300 text-white"
              unelevated
              @click="$router.push('/confirm-prescription')"
              >Check</q-btn
            >
          </div>
        </transition>
        <span class="mx-8" v-if="customMessage.length != 0">{{ customMessage }}</span>
        <div class="mt-32 mx-8" v-if="requestStatus !== 'OK'">
          <q-btn label="CANCEL MY REQUEST" color="red" unelevated outline @click="revokePrescriptionRequest" />
        </div>
      </div>
    </transition>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import * as prescription from 'src/api/prescription';
import { Dialog } from 'quasar';
import { useRouter } from 'vue-router';

import FirebaseUploader from 'src/components/FirebaseUploader';
import { getOrPromptForDeliveryLocation } from 'src/api/delivery-location';

export default defineComponent({
  name: 'PageIndex',
  components: { FirebaseUploader },
  setup() {
    const router = useRouter();
    onMounted(async () => {
      await new Promise((r) => setTimeout(r, 1000));
      const loc = await getOrPromptForDeliveryLocation();
      console.log(loc, !loc);
      if (!loc) {
        router.push('/home');
        Dialog.create({
          title: 'Cannot proceed without a delivery location',
          message:
            'Without a delivery location, we cannot process your prescription. Please set one up, be it in the settings page or on the prescribe page.',
          persistent: true,
        });
      }
    });
    return {
      ...prescription,
    };
  },
});
</script>

<style scoped></style>
