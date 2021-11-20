<template>
  <q-page>
    <div class="text-h6">Confirm Prescription</div>
    <div v-if="prescriptionToConfirm">
      <cart-item
        v-for="(item, idx) in prescriptionToConfirm.products"
        v-model="prescriptionToConfirm.products[idx]"
        :key="item.productId"
        :disable="true"
      />
    </div>
    <q-inner-loading :showing="isLoading">
      <q-spinner size="48px" />
    </q-inner-loading>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import * as prescription from 'src/api/prescription';
import { PrescriptionToConfirm } from 'src/models/PrescriptionToConfirm';

import CartItem from 'src/components/CartItem.vue';

export default defineComponent({
  name: 'ConfirmPrescription',
  components: { CartItem },
  setup() {
    const router = useRouter();
    const prescriptionToConfirm = ref<PrescriptionToConfirm | null>(null);
    const isLoading = ref(false);

    onMounted(async () => {
      isLoading.value = true;
      prescriptionToConfirm.value = await prescription.getLatestPrescription();
      isLoading.value = false;

      if (!prescriptionToConfirm.value?.isValid) {
        router.push('/home');
      }
    });

    return {
      prescriptionToConfirm,
      isLoading,
    };
  },
});
</script>
