<template>
  <q-page>
    <medrx-loader v-if="isLoading" style="height: calc(100vh - 150px)" />
    <div class="flex" v-else>
      <q-img
        :src="product?.photoUrl || placeholderImageUrl"
        ratio="1"
        class="w-full md:w-1/2 rounded-none md:rounded-xl shadow-md"
      ></q-img>
      <div class="mt-4 md:mt-0 divide-y divide-gray-300 px-8 space-y-4 w-full md:w-1/2">
        <div>
          <p class="text-h6 font-black">{{ product?.name }}</p>
          <div
            v-ripple
            class="relative flex -mt-3 -mx-2 p-2 rounded-sm"
            @click="$router.push(`/vendor/${product?.vendorId}`)"
          >
            <p class="mr-1">Sold by</p>
            <p class="font-black">{{ product?.vendorName.toUpperCase() }}</p>
          </div>
          <div>{{ product?.description }}</div>
          <div class="flex content-center justify-end">
            <div class="text-h6 font-black p-0 m-0">{{ product?.price }}</div>
            <div class="text-h6 p-0 m-0">PHP</div>
          </div>
        </div>
        <div class="pt-4">
          <div class="grid grid-cols-2 gap-2">
            <q-input v-model.number="quantity" type="number" min="1" outlined dense maxlength="12" label="Quantity" />
            <q-btn
              class="px-8 bg-gradient-to-tr from-medrx to-green-200"
              text-color="white"
              flat
              @click="addToCart(product?.id ?? '', product?.name ?? '', quantity, product?.price ?? 0)"
              >Add to Cart</q-btn
            >
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { Product } from 'src/models/Product';
import { isLoading, getProduct } from 'src/api/product';
import { addToCart } from 'src/api/cart';
import { placeholderImageUrl } from 'src/api/storage';
import MedrxLoader from 'src/components/MedrxLoader.vue';

export default defineComponent({
  components: { MedrxLoader },
  name: 'ProductPage',
  setup() {
    const router = useRouter();
    const productId = router.currentRoute.value.params.id;
    const product = ref<Product | null>(null);
    const quantity = ref(1);

    // const addToCart = async () => {
    //   addToCart(productId as string, product.value?.name, quantity.value, product.value?.price)
    // }

    onMounted(async () => {
      product.value = await getProduct(productId as string);
    });

    watch(quantity, (newQuantity) => {
      if (newQuantity < 1) {
        quantity.value = 1;
      }
    });

    return {
      placeholderImageUrl,
      addToCart,
      isLoading,
      product,
      quantity,
    };
  },
});
</script>
