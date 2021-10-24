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

        <div class="grid-cols-4 grid">
          <div v-for="header in headers" :key="header">
            <div class="text-l font-semibold mb-4">{{ header }}</div>
          </div>
        </div>

        <div dense v-for="item in cart" :key="item" class="grid-cols-4 grid">
          <!--can be a component-->
          <div dense class="font-black">{{ item.productName }}</div>
          <q-input
            @change="update(item.productId, item.productName, item.productQuantity, item.productPrice)"
            v-model="item.productQuantity"
            dense
            type="number"
            style="max-width: 30px"
            class="ml-3"
          />
          <div class="pt-2.5">{{ item.productPrice }}</div>
          <div class="col items-end pt-2.5">{{ item.amount }}</div>
          <!--can be a component-->
        </div>

        <q-separator class="my-3" />

        <div dense class="grid-cols-4 grid">
          <div>Subtotal</div>
          <div></div>
          <div></div>
          <div>{{ subTotal }}</div>

          <div>Delivery fee</div>
          <div></div>
          <div></div>
          <div>{{ fee }}</div>
        </div>

        <q-separator class="my-3" />

        <div dense class="grid-cols-4 grid">
          <div class="font-bold">Total</div>
          <div></div>
          <div></div>
          <div>{{ total }}</div>
        </div>
      </div>

      <q-separator color="grey" spaced />

      <q-item-label class="text-l font-semibold mb-4">Payment Method</q-item-label>
      <q-select disable Rounded filled v-model="model" :options="options" label="Cash-on-Delivery">
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
import { cart, total, subTotal, updateCart, getAmount, removeProduct } from 'src/api/cart';
import { useQuasar } from 'quasar';

export default {
  setup() {
    const address = ref('');
    const fee = ref(0);
    const quasar = useQuasar();

    onMounted(async () => {
      address.value = (await getUser())?.address as string;
    });

    const update = async (productId: string, productName: string, productQuantity: number, productPrice: number) => {
      if (productQuantity > 0) {
        await updateCart(productId, productName, productQuantity, productPrice);
      } else if (productQuantity == 0) {
        removeProduct(productId);
      } else {
        quasar.notify({ type: 'negative', message: 'Please type a valid number!' });
      }
    };

    return {
      model: ref(null),
      options: ['Cash-on-Delivery'],
      headers: ['General Items', 'Quantity', 'Unit Price', 'Amount'],
      address,
      cart,
      subTotal,
      total,
      fee,
      update,
      printCart: () => console.log(cart.value),
    };
  },
};
</script>
