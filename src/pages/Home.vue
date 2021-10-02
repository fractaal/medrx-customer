<template>
  <q-page class="bg-body">
    <div class="font-black text-2xl p-4 -mb-10">If you want to live...</div>
    <div class="p-4 -mb-4">
      Buy these essential medical products!
      <i>Or die.</i>
    </div>
    <horizontal-scroller>
      <product-card
        clickable
        @click="confirm = true"
        v-for="i in 20"
        :key="i"
        name="Name"
        description="Test"
        :price="69.420"
      />
    </horizontal-scroller>

    <q-dialog v-model="confirm" position="bottom">
      <q-card>
        <q-list>
          <q-card-actions align="around">
            <q-btn
              dense
              class="glossy ml-4"
              round
              color="primary"
              icon="remove"
              @click="quantityChecker()"
            />
            <div class="p-3" v-bind="quantity">{{ quantity }}</div>
            <q-btn dense class="glossy" round color="primary" icon="add" @click="quantity++" />
            <q-btn
              flat
              label="Confirm"
              color="primary"
              style="width: 100px"
              v-close-popup
              @click="addToCart()"
            />
          </q-card-actions>
        </q-list>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue';
import ProductCard from 'src/components/ProductCard.vue';
import HorizontalScroller from 'src/components/HorizontalScroller.vue';

export default defineComponent({
  name: 'PageIndex',
  components: { ProductCard, HorizontalScroller },
  setup() {

    const quantity = ref(1);

    const quantityChecker = () => {
      if (quantity.value > 0) {
        quantity.value--
      }
    }

    const addToCart = (/*product ID, Product quantity, Product price*/) => {
      //Send to backend for cart of specific user?
      console.log('Added to Cart!');
      //Reset counter
      setTimeout(() => { quantity.value = 1; }, 500);;
    };
    return {

      //Variables:
      quantity,

      //Methods:
      addToCart,
      quantityChecker,
      //dialog references:

      confirm: ref(false)
    }
  }
})


</script>

<style scoped>
</style>