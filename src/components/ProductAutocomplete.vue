<template>
  <div>
    <q-input label="Search for a product..." v-model="searchTerm" />
    <!-- Display some autocomplete based on searchResults -->
    <transition name="list">
      <q-list
        class="absolute mt-2 shadow-lg p-4 rounded-lg max-h-72 overflow-y-auto bg-white z-10"
        v-if="searchResults.length !== 0"
      >
        <q-item
          v-for="product in searchResults"
          :key="product.id"
          clickable
          v-ripple
          @click="showProduct(product.id)"
          class="ring-1 ring-medrx mb-2 rounded-lg"
        >
          <q-item-section>
            <q-item-label>
              <q-item-label class="font-black">{{ product.name }}</q-item-label>
              <q-item-label overline class="font-black">{{ product.price }}</q-item-label>
              <q-item-label>{{ product.description }}</q-item-label>
            </q-item-label>
          </q-item-section>
          <q-item-section side> <q-btn icon="add" round @click="set" /> </q-item-section>
        </q-item>
      </q-list>
    </transition>
  </div>
</template>

<script lang="ts">
import { Product } from 'src/models/Product';
import { defineComponent, ref, watch, toRefs } from 'vue';
import { search as _search } from 'src/api/search';
import { CartItem } from 'src/models/CartItem';
import { Dialog } from 'quasar';
import ProductPage from 'src/pages/ProductPage.vue';

export default defineComponent({
  name: '',
  emits: ['input', 'removeItem'],
  props: {
    idx: {
      type: Number,
      default: 0,
      required: true,
    },
    value: {
      type: Object as () => CartItem,
    },
  },
  setup(props, ctx) {
    console.warn('THIS COMPONENT SHOULD NEVER BE USED AGAIN !!!!!!');
    // const { idx } = toRefs(props);
    const searchTerm = ref('');
    const searchResults = ref<Product[]>([]);

    const showProduct = (productId: string) => {
      window.open('http://' + window.location.host + '/#/' + 'product/' + productId);
    };

    const set = ({
      id,
      name,
      price,
      description,
    }: {
      id: string;
      name: string;
      price: number;
      description: string;
    }) => {
      ctx.emit('input', {
        id,
        name,
        price,
        description,
      });
    };

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
      set,
      showProduct,
      searchTerm,
      searchResults,
      search,
    };
  },
});
</script>
