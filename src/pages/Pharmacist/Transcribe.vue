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
            v-if="searchActive"
          >
            <transition name="list" mode="out-in">
              <q-spinner-tail v-if="searchIsLoading" class="block mx-auto text-medrx" size="32px" />
              <p v-else-if="!searchIsLoading && searchResults.length == 0">
                No product results found for <b>{{ searchTerm }}.</b>
              </p>
              <q-list v-else>
                <q-item v-for="result in searchResults" :key="result.id" clickable v-ripple>
                  <q-item-section>
                    <q-item-label class="font-black" title>{{ result.name }}</q-item-label>
                    <q-item-label caption :lines="1">{{ result.description }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label overline class="font-black">{{ result.price }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </transition>
          </div>
        </transition>
        <div class="flex mt-2">
          <q-btn label="Add a new item" @click="newItem" color="blue" unelevated class="mr-2" />
          <q-btn label="Return prescription" color="red" unelevated @click="returnPrescription" class="ml-auto" />
        </div>
        <q-separator class="mt-2" />
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, watch } from 'vue';
import { Dialog } from 'quasar';
import { useRouter } from 'vue-router';
import * as prescriptionRequests from 'src/api/pharmacist/prescription-requests';
import { CartItem } from 'src/models/CartItem';
import { search as _search } from 'src/api/search';

import ReturnPrescriptionDialog from 'src/components/ReturnPrescriptionDialog.vue';
import { Product } from 'src/models/Product';
type Item = CartItem | Record<string, never>;

export default defineComponent({
  name: 'PharmacistView',
  components: {},
  setup() {
    const router = useRouter();
    const items = ref<Item[]>([]);
    const viewedPrescriptionRequest = ref<prescriptionRequests.PrescriptionRequest | null>(null);

    // Search functions
    const searchIsLoading = ref(false);
    const searchTerm = ref('');
    const searchActive = computed(() => searchTerm.value.length > 2);
    const searchResults = ref<Product[]>([]);

    const search = async () => {
      searchIsLoading.value = true;
      const results = await _search(searchTerm.value);
      searchIsLoading.value = false;
      searchResults.value = results;
    };

    watch(searchTerm, () => {
      if (searchActive.value) {
        search();
      }
    });

    // Set viewedPrescriptionRequest onMounted
    onMounted(async () => {
      const prescriptionRequestId = router.currentRoute.value.params.id as string;
      const prescriptionRequest = await prescriptionRequests.getPrescriptionRequest(prescriptionRequestId);
      viewedPrescriptionRequest.value = prescriptionRequest;
    });

    // Shows the return prescription dialog and routes back to pharmacist if return was successful
    const returnPrescription = () => {
      Dialog.create({
        component: ReturnPrescriptionDialog,
        componentProps: { prescriptionRequestId: router.currentRoute.value.params.id },
      }).onOk(async (data: { message: string }) => {
        await prescriptionRequests.returnPrescriptionRequest(
          (router.currentRoute.value.params.id as string) ?? '',
          data.message
        );
        router.push('/pharmacist');
      });
    };

    const newItem = () => items.value.push({});
    const removeItem = (idx: number) => items.value.splice(idx, 1);

    return {
      newItem,
      removeItem,
      items,
      returnPrescription,
      viewedPrescriptionRequest,

      searchIsLoading,
      searchTerm,
      searchActive,
      searchResults,
    };
  },
});
</script>
