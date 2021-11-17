<template>
  <q-page>
    <q-item-label class="font-black" overline>TRANSCRIBE PRESCRIPTION</q-item-label>
    <div class="grid grid-cols-2 gap-4 mt-2">
      <div class="relative group">
        <!-- MedRx Image Viewer -->
        <div v-viewer class="h-[calc(100vh-255px)]">
          <q-img
            class="
              rounded-xl
              shadow-lg
              cursor-pointer
              h-[calc(100vh-255px)]
              filter
              group-hover:brightness-[0.15]
              transition-all
            "
            :src="viewedPrescriptionRequest && viewedPrescriptionRequest.photoUrl"
          />
        </div>
        <div class="absolute top-0 h-full w-full flex content-center justify-center pointer-events-none">
          <div class="group-hover:opacity-100 opacity-0 transition-all group-hover:scale-150">
            <q-icon size="72px" name="zoom_in" color="white" />
            <p class="text-white font-black text-center">View image</p>
          </div>
        </div>
        <div class="mt-2 space-x-2">
          <q-btn color="red" label="Return Prescription" @click="returnPrescription" outline />
          <q-btn color="primary" label="Submit Prescription" @click="submitPrescription" unelevated />
        </div>
      </div>
      <div class="relative">
        <!-- factor out to search component -->
        <q-input
          class="w-full"
          dense
          placeholder="Search for a product..."
          outlined
          v-model="searchTerm"
          debounce="0"
        />
        <transition name="list">
          <div
            class="absolute top-11 z-20 w-full shadow-xl bg-white p-4 rounded-lg ring-1 ring-medrx"
            v-if="searchIsActive"
          >
            <transition name="list" mode="out-in">
              <q-spinner-tail v-if="searchIsLoading" class="block mx-auto text-medrx" size="32px" />
              <p v-else-if="!searchIsLoading && searchResults.length == 0">
                No product results found for <b>{{ searchTerm }}.</b>
              </p>
              <q-list v-else>
                <q-item v-for="result in searchResults" :key="result.id" clickable class="rounded-lg">
                  <q-item-section>
                    <q-item-label title
                      >{{ result.name }} - <b>{{ transformPrice(result.price) }}</b></q-item-label
                    >
                    <q-item-label caption :lines="1">{{ result.description }}</q-item-label>
                  </q-item-section>
                  <q-item-section side class="flex flex-row flex-nowrap space-x-2">
                    <q-btn
                      round
                      icon="add"
                      class="from-medrx to-green-200 bg-gradient-to-tr text-white"
                      unelevated
                      @click="
                        searchTerm = '';
                        addItemToPrescription(result);
                      "
                    />
                    <q-btn
                      round
                      icon="zoom_in"
                      class="from-blue-800 to-blue-300 bg-gradient-to-tr text-white"
                      unelevated
                      @click="viewItem(result.id)"
                    />
                  </q-item-section>
                </q-item>
              </q-list>
            </transition>
          </div>
        </transition>
        <q-separator class="mt-2" />
        <!-- Items list -->
        <q-list class="mt-2">
          <cart-item
            v-for="(item, idx) in prescription.cartItems"
            :key="item.productId"
            v-model="prescription.cartItems[idx]"
          />
        </q-list>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import { Dialog } from 'quasar';
import { useRouter } from 'vue-router';
import * as prescriptionRequests from 'src/api/pharmacist/prescription-requests';
import * as prescriptions from 'src/api/pharmacist/prescriptions';
import { useNamedSearch } from 'src/api/search';

import ProductDialog from 'src/components/ProductDialog.vue';

import ReturnPrescriptionDialog from 'src/components/Pharmacist/ReturnPrescriptionDialog.vue';
import CartItem from 'src/components/CartItem.vue';

export default defineComponent({
  name: 'PharmacistTranscribe',
  inject: ['transformPrice'],
  components: { CartItem },
  setup() {
    const router = useRouter();
    const viewedPrescriptionRequest = ref<prescriptionRequests.PrescriptionRequest | null>(null);

    // Search functions
    const _search = useNamedSearch('pharmacist');

    onMounted(async () => {
      // Set viewedPrescriptionRequest onMounted
      const prescriptionRequestId = router.currentRoute.value.params.id as string;
      const prescriptionRequest = await prescriptionRequests.getPrescriptionRequest(prescriptionRequestId);
      viewedPrescriptionRequest.value = prescriptionRequest;

      // Setup prescriptions onMounted
      prescriptions.createPrescriptionForUser(prescriptionRequestId);
    });

    // Confirm navigation away on before route leave
    onBeforeRouteLeave((_, __, next) => {
      if (prescriptions.prescription.value.cartItems.length > 0) {
        Dialog.create({
          title: 'Are you sure?',
          message: 'You have items in this transcription. Are you sure you want to leave?',
          focus: 'cancel',
          cancel: 'Cancel',
          ok: 'Leave',
        })
          .onOk(() => next(true))
          .onCancel(() => next(false));
      } else {
        next();
      }
    });

    // Shows the return prescription dialog and routes back to pharmacist if return was successful
    const returnPrescription = () => {
      Dialog.create({
        component: ReturnPrescriptionDialog,
        componentProps: { prescriptionRequestId: router.currentRoute.value.params.id },
      }).onOk(async (data: { message: string }) => {
        prescriptions.prescription.value.cartItems = []; // Clear items so that navigation confirmation doesn't occur
        await prescriptionRequests.returnPrescriptionRequest(
          (router.currentRoute.value.params.id as string) ?? '',
          data.message
        );
        router.push('/pharmacist');
      });
    };

    return {
      returnPrescription,
      viewedPrescriptionRequest,
      viewItem: (productId: string) => {
        Dialog.create({
          component: ProductDialog,
          componentProps: {
            productId,
          },
        });
      },

      ...prescriptions,
      ..._search,
    };
  },
});
</script>
