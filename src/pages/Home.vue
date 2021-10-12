<template>
  <q-page class="bg-body">
    <div class="font-black text-2xl p-4 -mb-10">If you want to live...</div>
    <div class="p-4 -mb-4">
      Buy these essential medical products!
      <i>Or die.</i>
    </div>
    <horizontal-scroller>
      <q-spinner class="block mx-auto" size="xl" v-if="storefrontIsLoading" />
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
    </horizontal-scroller>
    <!-- <q-dialog v-model="confirm" position="bottom">
      <q-card>
        <q-list>
          <q-card-actions align="around">
            <q-btn dense class="glossy ml-4" round color="primary" icon="remove" @click="quantityChecker()" />
            <div class="p-3">{{ quantity }}</div>
            <q-btn dense class="glossy" round color="primary" icon="add" @click="quantity++" />
            <q-btn flat label="Confirm" color="primary" style="width: 100px" v-close-popup />
          </q-card-actions>
        </q-list>
      </q-card>
    </q-dialog> -->
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import ProductCard from 'src/components/ProductCard.vue';
import HorizontalScroller from 'src/components/HorizontalScroller.vue';
import * as storefront from 'src/api/storefront';

export default defineComponent({
  name: 'PageIndex',
  components: { ProductCard, HorizontalScroller },
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
