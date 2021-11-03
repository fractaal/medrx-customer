<template>
  <div>
    <q-input label="Search for a product..." v-model="searchTerm" />
    <!-- Display some autocomplete based on searchResults -->
    <q-list dense class="absolute top-4" v-if="searchResults.length !== 0">
      <q-item v-for="product in searchResults" :key="product.id">
        <q-item-section>
          <q-item-label>
            <q-item-label-title>{{ product.name }}</q-item-label-title>
          </q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <q-item-label-subtitle>{{ product.price }}</q-item-label-subtitle>
          </q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <q-item-label-subtitle>{{ product.description }}</q-item-label-subtitle>
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script lang="ts">
import { Product } from 'src/models/Product';
import { defineComponent, ref, watch } from 'vue';
import { search as _search } from 'src/api/search';

export default defineComponent({
  name: '',
  setup() {
    const searchTerm = ref('');
    const searchResults = ref<Product[]>([]);

    const search = async (term: string) => {
      const results = await _search(term);
      searchResults.value = results;
    };

    // Watch for changes to the search term and act accordingly
    watch(searchTerm, async (term: string) => {
      if (term.length > 2) {
        await search(term);
      } else {
        searchResults.value = [];
      }
    });

    return {
      searchTerm,
      searchResults,
      search,
    };
  },
});
</script>
