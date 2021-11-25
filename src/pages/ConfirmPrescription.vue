<template>
  <q-page class="px-4 my-4 bg-white shadow-lg sm:rounded-3xl sm:p-20">
    <div v-if="prescriptionToConfirm">
      <cart-item
        v-for="(item, idx) in prescriptionToConfirm.products"
        v-model="prescriptionToConfirm.products[idx]"
        :key="item.productId"
        :disable="true"
      />
      <div class="absolute bottom-4 left-0 px-4 w-full sm:p-20">
        <div class="rounded-lg bg-gray-200 p-2 ring-1 ring-gray-300">
          <div v-if="prescriptionToConfirm.extraRemarks && prescriptionToConfirm.extraRemarks.length !== 0">
            {{ prescriptionToConfirm.extraRemarks }}
          </div>
          <empty-placeholder v-else icon="check" text="No extra remarks" />
        </div>
        <p class="text-center mt-4">
          If you've checked and verified that this prescription is what you expected it to be, press confirm to set this
          up for delivery. Otherwise, press cancel.
        </p>
        <div class="grid grid-cols-6 py-4 gap-4">
          <q-btn
            class="col-span-4 text-white bg-gradient-to-tr from-medrx to-green-300 shadow-lg"
            unelevated
            label="Confirm"
            @click="confirmLatestPrescription"
          />
          <q-btn class="col-span-2 shadow-lg" unelevated color="red" label="Cancel" @click="cancelLatestPrescription" />
        </div>
      </div>
    </div>
    <q-inner-loading :showing="isLoading">
      <q-spinner size="48px" />
    </q-inner-loading>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { Dialog } from 'quasar';
import { useRouter } from 'vue-router';
import * as prescription from 'src/api/prescription';
import { PrescriptionToConfirm } from 'src/models/PrescriptionToConfirm';

import CartItem from 'src/components/CartItem.vue';
import EmptyPlaceholder from 'src/components/EmptyPlaceholder.vue';

export default defineComponent({
  name: 'ConfirmPrescription',
  components: { CartItem, EmptyPlaceholder },
  setup() {
    const router = useRouter();
    const prescriptionToConfirm = ref<PrescriptionToConfirm | null>(null);
    const isLoading = ref(false);

    onMounted(async () => {
      isLoading.value = true;
      const x = await prescription.getLatestPrescription();
      if (!x.isValid) {
        router.push('/home');
        Dialog.create({
          persistent: true,
          title: 'Already confirmed',
          message: "You have already confirmed this prescription. We've redirected you back to the home page!",
        });
      } else {
        prescriptionToConfirm.value = x;
      }
      isLoading.value = false;
    });

    return {
      confirmLatestPrescription: async () => {
        isLoading.value = true;
        await prescription.confirmLatestPrescription();
        isLoading.value = false;
        router.push('/home');
      },
      cancelLatestPrescription: async () => {
        isLoading.value = true;
        await prescription.cancelLatestPrescription();
        isLoading.value = false;
        router.push('/home');
      },

      prescriptionToConfirm,
      isLoading,
    };
  },
});
</script>
