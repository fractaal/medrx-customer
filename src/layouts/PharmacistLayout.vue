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
            <q-item-label class="font-black" overline>PRESCRIPTION VIEW</q-item-label>
            <q-btn
              class="absolute h-full w-2 left-0 top-0"
              flat
              color="primary"
              size="24px"
              :icon="leftDrawerOpen ? 'arrow_left' : 'arrow_right'"
              @click="leftDrawerOpen = !leftDrawerOpen"
            />

            <transition
              enter-active-class="animated slideInRight"
              leave-active-class="animated slideOutRight"
              mode="out-in"
              appear
              :duration="150"
            >
              <div v-if="viewedPrescriptionRequest" class="w-full">
                <div class="text-4xl font-bold">
                  {{ viewedPrescriptionRequest.firstName }}
                  {{ viewedPrescriptionRequest.middleName }}
                  {{ viewedPrescriptionRequest.lastName }}
                </div>
                <q-img
                  ratio="4/3"
                  height="500px"
                  class="rounded-xl shadow-lg flex content-center justify-center cursor-pointer"
                  :src="viewedPrescriptionRequest.photoUrl"
                />
                <div class="my-4">
                  <q-btn
                    outline
                    label="View original image"
                    @click="redirectToPhoto(viewedPrescriptionRequest?.photoUrl ?? '')"
                  />
                </div>
                <q-separator></q-separator>
                <div class="flex md:grid grid-cols-12 gap-4 mt-4">
                  <q-btn class="col-span-6 w-full bg-medrx text-white p-4 shadow-lg" flat no-caps rounded>
                    <div>
                      <div class="text-2xl font-black"><q-icon name="check" size="32px" class="-mt-1 mr-2" />CLAIM</div>
                      <div>
                        Start transcribing this prescription.<br /><br />
                        This option prompts you to search for the appropriate items in this prescription among MedRx
                        stores.
                      </div>
                    </div>
                  </q-btn>
                  <q-btn
                    class="col-span-4 w-full bg-yellow-600 text-white p-4 shadow-lg"
                    flat
                    no-caps
                    rounded
                    @click="returnPrescriptionRequest(viewedPrescriptionRequest?.userId ?? '')"
                  >
                    <div>
                      <div class="text-2xl font-black">
                        <q-icon name="logout" size="32px" class="-mt-1 mr-2" />RETURN
                      </div>
                      <div>
                        The image is too blurry, or some other reason makes it difficult to transcribe. <br /><br />
                        This option fails the user’s prescription request.
                      </div>
                    </div>
                  </q-btn>
                  <q-btn
                    class="col-span-2 w-full bg-red-600 text-white p-4 shadow-lg"
                    flat
                    no-caps
                    rounded
                    @click="restrictUser(viewedPrescriptionRequest?.userId ?? '')"
                  >
                    <div>
                      <div class="text-2xl font-black">
                        <q-icon name="dangerous" size="32px" class="-mt-1 mr-2" />RESTRICT
                      </div>
                      <div>This image is inappropriate.</div>
                    </div>
                  </q-btn>
                </div>
              </div>
              <div v-else class="h-full w-full flex flex-col content-center justify-center opacity-50">
                <q-icon name="help" size="72px" class="mx-auto" />
                <div class="font-black italic text-2xl">No prescription request selected</div>
              </div>
            </transition>
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
  returnPrescriptionRequest as _returnPrescriptionRequest,
  restrictUser as _restrictUser,
} from 'src/api/pharmacist/prescription-requests';
import { defineComponent, ref, watch } from 'vue';
import { LocalStorage, Dialog } from 'quasar';

import ReturnPrescriptionDialog from 'src/components/ReturnPrescriptionDialog.vue';

export default defineComponent({
  name: 'PharmacistLayout',
  setup() {
    import('src/api/pharmacist/prescription-requests');
    const leftDrawerOpen = ref(true);
    const pingDrawer = ref(false);
    const warnedMobileExperience = ref(false);
    const viewedPrescriptionRequest = ref<PrescriptionRequest | null>(null);

    const restrictUser = (prescriptionRequestId: string) => {
      Dialog.create({
        title: 'Are you sure?',
        message: "By restricting this user, they won't be able send their prescriptions until they are unrestricted.",
        color: 'red',
        cancel: true,
        focus: 'cancel',
      }).onOk(async () => {
        await _restrictUser(
          prescriptionRequestId,
          'The image you sent was inappropriate and you have been restricted from uploading more prescriptions for a time.'
        );
      });
    };

    const returnPrescriptionRequest = (prescriptionRequestId: string) => {
      Dialog.create({ component: ReturnPrescriptionDialog, componentProps: { prescriptionRequestId } }).onOk(
        (data: { message: string }) => {
          _returnPrescriptionRequest(prescriptionRequestId, data.message);
        }
      );
    };

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
      returnPrescriptionRequest,
      restrictUser,

      // Methods
      viewPrescriptionRequest,
      redirectToPhoto(url: string) {
        window.open(url);
      },
    };
  },
});
</script>
