<template>
  <q-layout>
    <q-header class="bg-transparent">
      <q-toolbar class="bg-transparent text-black">
        <q-btn flat round dense icon="arrow_left" @click="$router.back()" class="q-mr-sm" />
        <q-toolbar-title>MedRx Pharmacist</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page>
      <q-page-container>
        <div class="flex flex-nowrap transition-all duration-100 p-4" style="height: calc(100vh - 50px)">
          <div
            class="h-full overflow-y-auto shadow-xl rounded-md ring-medrx transition-all duration-200 mr-2"
            :class="leftDrawerOpen ? 'w-1/4 ring-2' : 'w-0 ring-0'"
          >
            <div v-show="leftDrawerOpen" class="space-y-2 p-4">
              <transition-group name="list">
                <div v-for="(request, id) in prescriptionRequests" :key="id">
                  <product-item
                    :itemname="request.firstName + ' ' + request.middleName + ' ' + request.lastName"
                    description="placeholder"
                    :photoUrl="request.photoUrl"
                  >
                  </product-item>
                </div>
              </transition-group>
            </div>
          </div>
          <div
            class="relative h-full shadow-xl rounded-md ring-2 ring-medrx transition-all duration-100"
            :class="leftDrawerOpen ? 'w-3/4' : 'w-full'"
          >
            <span class="flex absolute -left-7 -top-7">
              <span
                class="absolute inline-flex h-full w-full rounded-full bg-medrx"
                :class="pingDrawer ? 'animate-ping' : ''"
              >
              </span>
              <q-btn
                color="primary"
                round
                size="18PX"
                :icon="leftDrawerOpen ? 'arrow_left' : 'arrow_right'"
                @click="leftDrawerOpen = !leftDrawerOpen"
              />
            </span>
          </div>
        </div>
      </q-page-container>
    </q-page>
  </q-layout>
</template>

<script lang="ts">
import ProductItem from 'src/components/ProductItem.vue';
import { prescriptionRequests } from 'src/api/pharmacist/prescription-requests';
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  components: { ProductItem },
  name: 'PharmacistLayout',
  setup() {
    import('src/api/pharmacist/prescription-requests');
    const leftDrawerOpen = ref(true);
    const pingDrawer = ref(false);

    watch(prescriptionRequests, () => {
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
      pingDrawer,
    };
  },
});
</script>
