<template>
  <q-page>
    <q-input
      class="mt-4 px-4"
      placeholder="Search for products..."
      rounded
      outlined
      :debounce="500"
      v-model="searchTerm"
    ></q-input>
    <div class="mt-4">
      <q-spinner v-if="isLoading" size="xl" class="block mx-auto" />
      <q-list padding class="space-y-2" v-else>
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
import { searchTerm, searchResults, isLoading } from 'src/api/search';
import ProductItem from 'src/components/ProductItem.vue';

export default defineComponent({
  name: 'Search',
  components: { ProductItem },
  setup() {
    return {
      searchTerm,
      searchResults,
      isLoading,
    };
  },
});
</script>
