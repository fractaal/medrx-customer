<template>
  <q-page>
    <q-spinner class="w-1/2 mx-auto" v-if="isLoading" size="96px" />
    <div class="flex mt-16 flex-nowrap" v-else>
      <q-card class="w-full md:w-1/2 rounded-none md:rounded-xl">
        <q-img src="https://cdn.quasar.dev/img/parallax2.jpg"></q-img>
      </q-card>
      <div class="mt-4 md:mt-0 divide-y divide-gray-300 px-8 space-y-4 w-full md:w-1/2">
        <div>
          <q-item-label class="text-h4 font-black">{{ product?.name }}</q-item-label>
          <q-item-label overline>{{ product?.vendorName }}</q-item-label>
          <div class="text-h6">{{ product?.description }}</div>
          <div class="flex content-center justify-end">
            <div class="text-h5 font-black p-0 m-0">{{ product?.price }}</div>
            <div class="text-h6 p-0 m-0">PHP</div>
          </div>
        </div>
        <div class="pt-4">
          <div class="grid grid-cols-2 gap-2">
            <q-input v-model.number="quantity" type="number" min="1" outlined dense />
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

export default defineComponent({
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
      addToCart,
      isLoading,
      product,
      quantity,
    };
  },
});
</script>
