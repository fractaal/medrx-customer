<template>
  <q-page class='bg-body'>
      <div class="font-black text-2xl p-4 -mb-10">If you want to live...</div>
      <div class="p-4 -mb-4">Buy these essential medical products! <i>Or die.</i></div>
      <horizontal-scroller>
        <product-card v-for="i in 20" :key="i" name="Name" description="Test" :price="69.420"/>
      </horizontal-scroller>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
import ProductCard from 'src/components/ProductCard.vue';
import HorizontalScroller from 'src/components/HorizontalScroller.vue';

export default defineComponent({
  name: 'PageIndex',
  components: { ProductCard, HorizontalScroller },
  setup () {
    return {
    
    }
  }
})


</script>

<style scoped>
</style>