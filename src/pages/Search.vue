<template>
  <q-page>
    <div class="mt-4">
      <q-spinner v-if="isLoading" size="xl" class="block mx-auto" />
      <q-list padding class="space-y-2 px-2" v-else>
        <product-item
          v-for="product in searchResults"
          clickable
          @click="$router.push(`/product/${product.id}`)"
          :photo-url="product.photoUrl"
          :key="product.id"
          :itemname="product.name"
          :description="product.description"
          :price="product.price"
        />
      </q-list>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { searchResults, isLoading } from 'src/api/search';
import ProductItem from 'src/components/ProductItem.vue';

export default defineComponent({
  name: 'Search',
  components: { ProductItem },
  setup() {
    return {
      searchResults,
      isLoading,
    };
  },
});
</script>
