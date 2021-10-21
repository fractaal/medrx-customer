<template>
  <div class="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
    <div class="max-w-md mx-auto">
      <div>
        <q-item-label class="text-h6 mb-4">My Cart</q-item-label>

        <q-item dense clickable v-ripple @click="printCart()">
          <q-item-section avatar top>
            <q-avatar icon="place" color="primary" text-color="white" />
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1" class="text-lg">Pin your location</q-item-label>
            <q-item-label caption>{{ address }}</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-icon name="chevron_right" color="black" />
          </q-item-section>
        </q-item>

        <q-separator color="grey" spaced />

        <q-item-label class="text-h6 mb-4">Order Summary</q-item-label>
        <q-item-label class="text-l font-semibold mb-4">General Items</q-item-label>

        <q-item dense v-for="item in cart" :key="item">
          <q-item-section top class="font-black">{{ item.productName }}</q-item-section>
          <q-item-section>{{ item.productQuantity }}</q-item-section>
          <q-item-section side>{{ item.productPrice }}</q-item-section>
        </q-item>

        <q-item dense>
          <q-item-section top>Subtotal</q-item-section>
          <q-item-section side>{{ subTotal }}</q-item-section>
        </q-item>

        <q-item dense>
          <q-item-section top>Delivery fee</q-item-section>
          <q-item-section side>{{ fee }}</q-item-section>
        </q-item>

        <q-item dense>
          <q-item-section top class="font-semibold">Total</q-item-section>
          <q-item-section side>{{ total }}</q-item-section>
        </q-item>
      </div>

      <q-separator color="grey" spaced />

      <q-item-label class="text-l font-semibold mb-4">Payment Method</q-item-label>
      <q-select disable Rounded filled v-model="model" :options="options" label="Default Payment method">
        <template v-slot:prepend></template>
      </q-select>
      <div class="row justify-center">
        <q-btn class="mt-10" unelevated rounded color="primary" label="Place Order" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import { getUser } from 'src/api/firebase';
import { getCart, getTotal } from 'src/api/cart';
import { CartItem } from 'src/models/CartItem';

export default {
  setup() {
    const address = ref('');
    const cart = ref<Record<string, CartItem>>({});
    const subTotal = ref(0);
    const total = ref(0);
    const fee = ref(0);

    onMounted(async () => {
      address.value = (await getUser())?.address as string;
      cart.value = await getCart();
      subTotal.value = await getTotal();
      total.value = subTotal.value + fee.value;
    });

    return {
      model: ref(null),
      options: ['Cash-on-Delivery'],
      address,
      cart,
      subTotal,
      total,
      fee,
      printCart: () => console.log(cart.value),
    };
  },
};
</script>
