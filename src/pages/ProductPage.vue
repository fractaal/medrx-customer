<template>
  <q-page>
    <div class="flex mt-16">
      <q-card class="w-full md:w-1/2 rounded-none md:rounded-xl">
        <q-img src="https://cdn.quasar.dev/img/parallax2.jpg"></q-img>
      </q-card>
      <div class="mt-4 md:mt-0 divide-y divide-gray-300 px-8 space-y-4">
        <div>
          <q-item-label class="text-h4 font-black">Wowowiwa</q-item-label>
          <div class="text-h6">Lorem ipsum bla blablsalgasdofkjsadfiuoshduifo.</div>
        </div>
        <div class="pt-4">
          <div class="grid grid-cols-2 gap-2">
            <q-input v-model.number="quantity" type="number" min="1" outlined dense />
            <q-btn class="px-8 bg-gradient-to-tr from-medrx to-green-200" text-color="white" flat>Add to Cart</q-btn>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  name: 'ProductPage',
  setup() {
    const quantity = ref(1);

    watch(quantity, (newQuantity) => {
      if (newQuantity < 1) {
        quantity.value = 1;
      }
    });

    return {
      quantity,
    };
  },
});
</script>
