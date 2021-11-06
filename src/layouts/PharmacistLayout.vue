<template>
  <div
    class="h-screen flex content-center justify-center flex-col px-8"
    v-show="$q.screen.xs && !warnedMobileExperience"
  >
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
  <q-layout v-show="!($q.screen.xs && !warnedMobileExperience)">
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
            :class="leftDrawerOpen ? 'w-1/6 ring-1 p-4' : 'w-0 ring-0'"
          >
            <q-item-label v-show="leftDrawerOpen" class="font-black" overline>PRESCRIPTION REQUESTS</q-item-label>
            <div v-show="leftDrawerOpen" class="space-y-2 mt-2 h-full">
              <transition-group name="list">
                <empty-placeholder
                  :key="'empty-placeholder'"
                  v-if="numPrescriptionRequests == 0 && !isLoading"
                  v-show="leftDrawerOpen"
                  icon="help"
                  text="No prescription requests available."
                />
                <div v-for="(request, id) in prescriptionRequests" :key="id">
                  <q-card
                    v-if="!isLoading"
                    v-ripple
                    class="shadow-lg p-4 ring-1 ring-medrx"
                    @click="viewPrescriptionRequest(request.userId)"
                    :class="$route.fullPath.includes(request.userId) ? ' ring-blue-700 bg-blue-500 text-white' : ''"
                  >
                    <div class="font-black">
                      {{ request.firstName + ' ' + request.middleName + ' ' + request.lastName }}
                    </div>
                  </q-card>
                </div>
                <div v-for="i in 4" :key="i">
                  <div v-if="isLoading">
                    <q-card class="p-4 shadow-lg ring-1 ring-gray-300">
                      <q-skeleton type="text" :width="(Math.random() * 50 + 30).toFixed(0) + 'px'" />
                    </q-card>
                  </div>
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
            :class="leftDrawerOpen ? 'w-5/6' : 'w-full'"
          >
            <q-btn
              class="absolute h-full w-2 left-0 top-0"
              flat
              color="primary"
              size="24px"
              :icon="leftDrawerOpen ? 'arrow_left' : 'arrow_right'"
              @click="leftDrawerOpen = !leftDrawerOpen"
            >
              <span
                class="h-8 w-8 rounded-full bg-medrx animate-ping absolute -left-4 top-[48.25%]"
                v-if="pingDrawer"
              />
              <span class="h-8 w-8 rounded-full bg-medrx absolute -left-4 top-[48.25%]" v-if="pingDrawer" />
            </q-btn>
            <router-view v-slot="{ Component }">
              <transition
                enter-active-class="animated fadeIn"
                leave-active-class="animated fadeOut"
                appear
                :duration="150"
              >
                <component :is="Component" />
              </transition>
            </router-view>
          </div>
        </div>
      </q-page-container>
    </q-page>
  </q-layout>
</template>

<script lang="ts">
import { prescriptionRequests, numPrescriptionRequests, isLoading } from 'src/api/pharmacist/prescription-requests';
import { defineComponent, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import EmptyPlaceholder from 'src/components/EmptyPlaceholder.vue';

export default defineComponent({
  name: 'PharmacistLayout',
  components: {
    EmptyPlaceholder,
  },
  setup() {
    import('src/api/pharmacist/prescription-requests');
    const leftDrawerOpen = ref(true);
    const pingDrawer = ref(false);
    const warnedMobileExperience = ref(false);
    const router = useRouter();

    const viewPrescriptionRequest = async (prescriptionRequestId: string) => {
      await router.push({ path: '/pharmacist/view-prescription/' + prescriptionRequestId });
    };

    watch(prescriptionRequests, () => {
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
      isLoading,

      // Methods
      viewPrescriptionRequest,
    };
  },
});
</script>
