<template>
  <q-page class="bg-body">
    <medrx-loader v-if="storefrontIsLoading" style="height: calc(100vh - 150px)" />
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mx-4">
      <product-card
        v-for="item in storefront"
        clickable
        @click="$router.push(`/product/${item.id}`)"
        :photo-url="item.photoUrl"
        :key="item.id"
        :name="item.name"
        :description="item.vendorName"
        :price="item.price"
      />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import ProductCard from 'src/components/ProductCard.vue';
import MedrxLoader from 'src/components/MedrxLoader.vue';
import * as storefront from 'src/api/storefront';

export default defineComponent({
  name: 'PageIndex',
  components: { ProductCard, MedrxLoader },
  setup() {
    onMounted(() => {
      storefront.getStorefront();
    });

    return {
      // Storefront
      storefront: storefront.storefront,
      storefrontIsLoading: storefront.isLoading,
    };
  },
});
</script>

<style scoped></style>
