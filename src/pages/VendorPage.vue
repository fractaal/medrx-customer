<template>
  <q-page>
    <medrx-loader v-if="vendorIsLoading" class="h-screen" />
    <div v-else>
      <div class="flex">
        <q-img
          :src="vendorData?.photoUrl || placeholderImageUrl"
          class="w-full h-32 md:h-64 rounded-none md:rounded-md shadow-md"
        >
        </q-img>
        <p class="px-4 mt-2 text-h6 font-black">{{ vendorData?.name }}</p>
        <div class="divide-y divide-gray-300 px-4 space-y-4">
          <p>{{ vendorData?.content }}</p>
        </div>
      </div>
      <br />
      <q-separator />
      <br />
      <div class="px-4">
        <div class="flex space-x-2 content-center">
          <div class="space-x-2">
            <q-btn
              icon="arrow_left"
              round
              unelevated
              class="shadow-md bg-white"
              @click="changePageNumber(-1)"
              :disable="pageNumber == 0"
            ></q-btn>
            <q-btn
              icon="arrow_right"
              round
              unelevated
              class="shadow-md bg-white"
              @click="changePageNumber(1)"
              :disable="pageNumber == maxPageNumber"
            ></q-btn>
          </div>
          <span class="flex content-center">
            {{ productsData?.total }} products in total (Page {{ pageNumber + 1 }} of {{ maxPageNumber + 1 }})
          </span>
        </div>
        <br />
        <div>
          <medrx-loader v-if="productsIsLoading" />
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4" v-else>
            <product-card
              v-for="item in productsData?.results"
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
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { Data, Products, Vendor } from 'src/models/Vendor';
import { vendorIsLoading, productsIsLoading, getVendor, getVendorProducts } from 'src/api/vendor';
import { addToCart } from 'src/api/cart';
import { placeholderImageUrl } from 'src/api/storage';
import ProductCard from 'src/components/ProductCard.vue';
import MedrxLoader from 'src/components/MedrxLoader.vue';

export default defineComponent({
  components: { ProductCard, MedrxLoader },
  name: 'ProductPage',
  setup() {
    const router = useRouter();
    const vendorId = router.currentRoute.value.params.id;
    const vendorData = ref<Vendor | null>(null);
    const productsData = ref<Products | null>(null);
    const pageNumber = ref(0);
    const maxPageNumber = ref(0);

    onMounted(async () => {
      vendorData.value = await getVendor(vendorId as string);
      productsData.value = await getVendorProducts(vendorId as string, pageNumber.value);
      maxPageNumber.value = Math.floor((productsData.value.total ?? 0) / 10);
    });

    watch(pageNumber, async (newPageNumber) => {
      productsData.value = await getVendorProducts(vendorId as string, newPageNumber);
      // maxPageNumber.value = Math.floor((vendorData.value?.products.total ?? 0) / 10);
    });

    const changePageNumber = (inc: number) => {
      pageNumber.value = Math.min(Math.max(pageNumber.value + inc, 0), maxPageNumber.value);
    };

    return {
      placeholderImageUrl,
      addToCart,
      vendorIsLoading,
      productsIsLoading,
      vendorData,
      productsData,
      pageNumber,
      maxPageNumber,
      changePageNumber,
    };
  },
});
</script>
