<template>
  <q-layout>
    <q-page>
      <q-page-container>
        <div class="flex flex-nowrap transition-all duration-100 p-4 h-screen">
          <div
            class="h-full overflow-y-auto shadow-xl rounded-md ring-1 ring-medrx transition-all duration-100 mr-2"
            :class="test ? 'w-1/4' : 'w-0'"
          >
            <div v-show="test" class="space-y-2 p-4">
              <transition-group name="list">
                <div v-for="(request, id) in prescriptionRequests" :key="id">
                  <product-item
                    :title="request.firstName + ' ' + request.middleName + ' ' + request.lastName"
                    description="placeholder"
                    :photoUrl="request.photoUrl"
                  >
                  </product-item>
                </div>
              </transition-group>
            </div>
          </div>
          <div
            class="h-full shadow-xl rounded-md ring-1 ring-medrx transition-all duration-100"
            :class="test ? 'w-3/4' : 'w-full'"
          >
            <q-toggle v-model="test" />
          </div>
        </div>
      </q-page-container>
    </q-page>
  </q-layout>
</template>

<script lang="ts">
import ProductItem from 'src/components/ProductItem.vue';
import { prescriptionRequests } from 'src/api/pharmacist/prescription-requests';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  components: { ProductItem },
  name: 'PharmacistLayout',
  setup() {
    import('src/api/pharmacist/prescription-requests');
    const test = ref(true);
    return {
      test,
      prescriptionRequests,
    };
  },
});
</script>
