<template>
  <q-page>
    <medrx-loader v-if="isLoading" style="height: calc(100vh - 150px)" />
    <div class="flex" v-else>
      <div v-viewer class="w-full md:w-1/2">
        <q-img :src="product?.photoUrl || placeholderImageUrl" ratio="1" class="rounded-none md:rounded-xl shadow-md" />
      </div>
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
            <div class="text-h6 font-black p-0 m-0">{{ transformPrice(product?.price ?? 0) }}</div>
          </div>
        </div>
        <div class="pt-4">
          <div class="grid grid-cols-2 gap-2">
            <div class="grid-cols-3 grid place-items-center">
              <!-- <div class='ml-9'>
              <q-avatar clickable @click='quantity--' icon='remove'/>
            </div> -->
              <q-btn round flat @click="quantity--" icon="remove" />
              <q-input v-model="quantity" type="number" style="max-width: 50px" dense />
              <q-btn round flat @click="quantity++" icon="add" />
              <!-- <div class="mr-9">
                <q-avatar lickable @click="quantity++" icon="add" />
              </div> -->
            </div>
            <!-- <q-input v-model.number="quantity" type="number" min="1" outlined dense maxlength="12" label="Quantity" /> -->
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
    <q-separator class="my-8" />
    <div v-if="!isLoading" class="py-4 px-4 sm:px-0">
      <q-item-label overline class="font-black"
        >OTHER PRODUCTS SOLD BY {{ product?.vendorName.toUpperCase() }}</q-item-label
      >
      <medrx-loader v-if="productsIsLoading" />
      <div class="mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4" v-else>
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
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import { useRouter, onBeforeRouteUpdate } from 'vue-router';
import { Product } from 'src/models/Product';
import { isLoading, getProduct } from 'src/api/product';
import { productsIsLoading, getVendorProducts } from 'src/api/vendor';
import { addToCart } from 'src/api/cart';
import { placeholderImageUrl } from 'src/api/storage';
import MedrxLoader from 'src/components/MedrxLoader.vue';
import ProductCard from 'src/components/ProductCard.vue';
import { Products } from 'src/models/Vendor';

export default defineComponent({
  components: { MedrxLoader, ProductCard },
  name: 'ProductPage',
  inject: ['transformPrice'],
  setup() {
    const router = useRouter();
    const productId = router.currentRoute.value.params.id;
    const product = ref<Product | null>(null);
    const quantity = ref(1);

    const productsData = ref<Products | null>(null);

    // const addToCart = async () => {
    //   addToCart(productId as string, product.value?.name, quantity.value, product.value?.price)
    // }

    onBeforeRouteUpdate(async (to, from) => {
      product.value = await getProduct(to.params.id as string);
      // productsData.value = await getVendorProducts(product.value?.vendorId);
    });

    onMounted(async () => {
      product.value = await getProduct(productId as string);
      productsData.value = await getVendorProducts(product.value?.vendorId);
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
      productsIsLoading,
      productsData,
      product,
      quantity,
    };
  },
});
</script>
