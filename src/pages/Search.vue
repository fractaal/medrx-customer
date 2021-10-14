<template>
  <q-page>
    <q-input :debounce="500" v-model="searchTerm"></q-input>
    <div>
      <p v-for="product in searchResults" :key="product.id">{{ product }}</p>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { searchTerm, searchResults } from 'src/api/search';

export default defineComponent({
  name: 'Search',
  setup() {
    return {
      searchTerm,
      searchResults,
    };
  },
});
</script>
