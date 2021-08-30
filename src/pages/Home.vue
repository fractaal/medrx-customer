<template>
  <q-page class='bg-body'>
      <div class="font-black text-2xl p-4 -mb-10">If you want to live...</div>
      <div class="p-4 -mb-4">Buy these essential medical products! <i>Or die.</i></div>
      <horizontal-scroller>
        <product-card v-for="i in 100" :key="i" name="Name" description="Test" :price="69.420"/>
      </horizontal-scroller>
    <q-footer>
      <q-tabs
            v-model="tab"
            dense
            class="navigation-menu"
          >
            <q-route-tab name="mails" label="Shop">
              <img src='../../public/icons/shop.svg'>
            </q-route-tab>
            <q-route-tab name="alarms" label="Prescription">
              <img src='../../public/icons/upload.svg'>
            </q-route-tab>
            <q-route-tab name="movies" label="Soon">
              <img src='../../public/icons/soon.svg'>
            </q-route-tab>
          </q-tabs>
    </q-footer>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
import { ref } from 'vue';
import ProductCard from 'src/components/ProductCard.vue';
import HorizontalScroller from 'src/components/HorizontalScroller.vue';

export default defineComponent({
  name: 'PageIndex',
  components: { ProductCard, HorizontalScroller },
  setup () {
    return {
      tab: ref('mails')
    }
  }
})


</script>

<style scoped>
.bg-body {
  background: #97f4e6;
}


.shadow-box {
  width: 90px;
  height: 90px;
  margin: 25px;
  font-size: 12px;
}

.navigation-menu {
  background: #6ae0ce;
  color: #ffffff;

}

</style>