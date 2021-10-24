<template>
  <q-page>
    <q-spinner class="w-1/2 mx-auto" v-if="isLoading" size="96px" />
    <div v-else>
      <div class="flex">
        <q-img
          :src="vendorData?.vendor.photoUrl || placeholderImageUrl"
          ratio="1"
          class="w-full md:w-1/2 rounded-none md:rounded-xl shadow-md"
        ></q-img>
        <div class="mt-4 md:mt-0 divide-y divide-gray-300 px-4 space-y-4 w-full md:w-1/2">
          <div>
            <p class="text-h6 font-black">{{ vendorData?.vendor.name }}</p>
            <div>{{ vendorData?.vendor.content }}</div>
          </div>
        </div>
      </div>
      <br />
      <q-separator />
      <br />
      <div class="px-4">
        <div class="flex space-x-2 content-center">
          <div class="space-x-2">
            <q-btn icon="arrow_left" round unelevated class="shadow-md bg-white" @click="changePageNumber(-1)"></q-btn>
            <q-btn icon="arrow_right" round unelevated class="shadow-md bg-white" @click="changePageNumber(1)"></q-btn>
          </div>
          <p>
            {{ vendorData?.products.total }} products in total (Page {{ pageNumber + 1 }} of {{ maxPageNumber + 1 }})
          </p>
        </div>
        <br />
        <div class="flex content-center gap-2">
          <product-card
            v-for="item in vendorData?.products.results"
            :key="item.id"
            :name="item.name"
            :photoUrl="item.photoUrl"
            :description="item.description"
            :price="item.price"
            @click="$router.push(`/product/${item.id}`)"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { Data } from 'src/models/Vendor';
import { isLoading, getVendor } from 'src/api/vendor';
import { addToCart } from 'src/api/cart';
import { placeholderImageUrl } from 'src/api/storage';
import ProductCard from 'src/components/ProductCard.vue';

export default defineComponent({
  components: { ProductCard },
  name: 'ProductPage',
  setup() {
    const router = useRouter();
    const vendorId = router.currentRoute.value.params.id;
    const vendorData = ref<Data | null>(null);
    const pageNumber = ref(0);
    const maxPageNumber = ref(0);

    onMounted(async () => {
      vendorData.value = await getVendor(vendorId as string);
      maxPageNumber.value = Math.floor((vendorData.value?.products.total ?? 0) / 10);
    });

    watch(pageNumber, async (newPageNumber) => {
      vendorData.value = await getVendor(vendorId as string, newPageNumber);
      maxPageNumber.value = Math.floor((vendorData.value?.products.total ?? 0) / 10);
    });

    const changePageNumber = (inc: number) => {
      pageNumber.value = Math.min(Math.max(pageNumber.value + inc, 0), maxPageNumber.value);
    };

    return {
      placeholderImageUrl,
      addToCart,
      isLoading,
      vendorData,
      pageNumber,
      maxPageNumber,
      changePageNumber,
    };
  },
});
</script>
