<template>
  <div class="h-screen flex content-center justify-center flex-col px-8" v-if="$q.screen.xs && !warnedMobileExperience">
    <q-icon name="sentiment_dissatisfied" size="64px" />
    <div class="text-xl font-black">MedRx Pharmacist is not optimized to work on mobile</div>
    <div>
      The Pharmacist interface is designed to work on desktop-size screens. Your experience with MedRx Pharmacist on
      this display might be less than ideal.
    </div>
    <div class="flex mt-4 space-y-4">
      <q-btn class="bg-medrx text-white mr-2 px-16" rounded label="Go back" @click="$router.back()" />
      <q-btn rounded flat label="Okay, take me there anyway" @click="warnedMobileExperience = true" />
    </div>
  </div>
  <q-layout v-else>
    <q-header class="bg-transparent">
      <q-toolbar class="bg-transparent text-black h-4">
        <q-btn flat round dense icon="arrow_left" @click="$router.back()" class="q-mr-sm" />
        <q-toolbar-title>MedRx Pharmacist</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page>
      <q-page-container>
        <div class="flex flex-nowrap transition-all duration-100 px-4 pb-4" style="height: calc(100vh - 50px)">
          <div
            class="h-full overflow-y-auto shadow-lg rounded-xl ring-medrx transition-all duration-200 mr-4"
            :class="leftDrawerOpen ? 'w-1/4 ring-1 p-4' : 'w-0 ring-0'"
          >
            <q-item-label v-show="leftDrawerOpen" class="font-black" overline>PRESCRIPTION REQUESTS</q-item-label>
            <div
              v-if="numPrescriptionRequests == 0"
              v-show="leftDrawerOpen"
              class="h-full w-full flex flex-col content-center justify-center opacity-50"
            >
              <q-icon name="help" size="72px" class="mx-auto" />
              <div class="font-black italic text-2xl">No prescription requests available</div>
            </div>
            <div v-else v-show="leftDrawerOpen" class="space-y-2 mt-2">
              <transition-group name="list">
                <div v-for="(request, id) in prescriptionRequests" :key="id">
                  <q-card
                    v-ripple
                    class="shadow-lg p-4 ring-1 ring-medrx"
                    @click="viewPrescriptionRequest(request.userId)"
                    :class="
                      viewedPrescriptionRequest?.userId === request.userId
                        ? ' ring-blue-700 bg-blue-500 text-white'
                        : ''
                    "
                  >
                    <div class="font-black">
                      {{ request.firstName + ' ' + request.middleName + ' ' + request.lastName }}
                    </div>
                  </q-card>
                </div>
              </transition-group>
            </div>
          </div>
          <div
            class="
              relative
              h-full
              overflow-y-auto overflow-x-hidden
              shadow-lg
              rounded-xl
              ring-1 ring-medrx
              transition-all
              duration-100
              p-4
              pl-8
            "
            :class="leftDrawerOpen ? 'w-3/4' : 'w-full'"
          >
            <q-btn
              class="absolute h-full w-2 left-0 top-0"
              flat
              color="primary"
              size="24px"
              :icon="leftDrawerOpen ? 'arrow_left' : 'arrow_right'"
              @click="leftDrawerOpen = !leftDrawerOpen"
            />
            <View :viewedPrescriptionRequest="viewedPrescriptionRequest" />
          </div>
        </div>
      </q-page-container>
    </q-page>
  </q-layout>
</template>

<script lang="ts">
import {
  PrescriptionRequest,
  prescriptionRequests,
  numPrescriptionRequests,
} from 'src/api/pharmacist/prescription-requests';
import { defineComponent, ref, watch } from 'vue';
import { LocalStorage } from 'quasar';
import View from 'src/pages/Pharmacist/View.vue';

export default defineComponent({
  components: { View },
  name: 'PharmacistLayout',
  setup() {
    import('src/api/pharmacist/prescription-requests');
    const leftDrawerOpen = ref(true);
    const pingDrawer = ref(false);
    const warnedMobileExperience = ref(false);
    const viewedPrescriptionRequest = ref<PrescriptionRequest | null>(null);

    const viewPrescriptionRequest = (prescriptionRequestId: string) => {
      if (prescriptionRequestId === viewedPrescriptionRequest.value?.userId) {
        viewedPrescriptionRequest.value = null;
        return;
      }

      viewedPrescriptionRequest.value = Object.values(prescriptionRequests.value).filter(
        (request) => (request.userId = prescriptionRequestId)
      )[0];

      LocalStorage.set('viewedPrescriptionRequestId', prescriptionRequestId);
    };

    let hasFirstLoadHappened = false;
    watch(prescriptionRequests, () => {
      // Get previously viewed prescription request if just navigating to this page
      if (!hasFirstLoadHappened) {
        hasFirstLoadHappened = true;
        const previousPrescriptionRequestId = LocalStorage.getItem('viewedPrescriptionRequestId');
        Object.values(prescriptionRequests.value).forEach((request) => {
          if (request.userId === previousPrescriptionRequestId) {
            viewPrescriptionRequest(previousPrescriptionRequestId);
          }
        });
      }

      // For visible UI element pinging if an update happens.
      if (!leftDrawerOpen.value) {
        pingDrawer.value = true;
      }
    });

    watch(leftDrawerOpen, () => {
      pingDrawer.value = false;
    });

    return {
      leftDrawerOpen,
      prescriptionRequests,
      numPrescriptionRequests,
      pingDrawer,
      warnedMobileExperience,
      viewedPrescriptionRequest,

      // Methods
      viewPrescriptionRequest,
    };
  },
});
</script>
