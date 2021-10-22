<template>
  <q-page>
    {{ requestStatus }}
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
      <div v-else class="text-center pt-64">
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
              <br />You should get a delivery notification shortly.
            </p>
          </div>
        </transition>
        <p>{{ customMessage }}</p>
      </div>
    </transition>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  performPrescriptionRequest,
  requestStatus,
  PrescriptionRequestStatus,
  customMessage,
} from 'src/api/prescription';

import FirebaseUploader from 'src/components/FirebaseUploader';

export default defineComponent({
  name: 'PageIndex',
  components: { FirebaseUploader },
  setup() {
    return {
      PrescriptionRequestStatus,
      requestStatus,
      performPrescriptionRequest,
      customMessage,
    };
  },
});
</script>

<style scoped></style>
