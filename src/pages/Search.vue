<template>
  <q-page>
    <q-input :debounce="500" v-model="searchTerm"></q-input>
      <div>
        <q-list bordered padding>
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
import { searchTerm, searchResults } from 'src/api/search';
import ProductItem from 'src/components/ProductItem.vue';

export default defineComponent({
  name: 'Search',
  components: { ProductItem },
  setup() {
    return {
      searchTerm,
      searchResults,
    };
  },
});
</script>
