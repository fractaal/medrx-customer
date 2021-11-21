<template>
  <q-page>
    <div class="mt-4">
      <transition name="list" mode="out-in" :duration="100">
        <q-list padding class="space-y-2 px-2" v-if="searchIsLoading">
          <product-item v-for="x in 4" :key="x" :isSkeleton="true" />
        </q-list>
        <q-list padding class="space-y-2 px-2" v-else-if="!searchIsLoading && searchResults.length !== 0">
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
        <empty-placeholder
          v-else-if="!isUntouched"
          icon="sentiment_dissatisfied"
          text="No results found. Try again with a different search!"
        />
        <empty-placeholder
          v-else-if="isUntouched"
          icon="fas fa-rocket"
          text="Try typing in the search box anything you want to look for!"
        />
      </transition>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { useNamedSearch } from 'src/api/search';
import ProductItem from 'src/components/ProductItem.vue';
import EmptyPlaceholder from 'src/components/EmptyPlaceholder.vue';

export default defineComponent({
  name: 'Search',
  components: { ProductItem, EmptyPlaceholder },
  setup() {
    const search = useNamedSearch('home');
    const isUntouched = ref(true);

    watch(search.searchIsLoading, () => (isUntouched.value = false));

    return {
      isUntouched,
      ...search,
    };
  },
});
</script>
