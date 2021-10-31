<template>
  <div class="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
    <div class="mx-auto">
      <div>
        <q-item-label class="text-h6 mb-4">My Cart</q-item-label>

        <q-item dense clickable v-ripple @click="printCart()" class="rounded-xl p-4">
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

        <div class="grid-cols-3 grid place-items-center">
          <div v-for="header in headers" :key="header">
            <div class="text-l font-semibold mb-4 place-items-center">{{ header }}</div>
          </div>
        </div>

        <div
          dense
          v-for="item in cart"
          :key="item"
          class="relative grid-cols-3 grid place-items-center rounded-xl p-4 hover:bg-gray-200"
        >
          <!--can be a component-->
          <div v-ripple dense class="relative font-black p-4" @click="$router.push(`/product/${item.productId}`)">
            {{ item.productName }}
          </div>

          <div class="grid-cols-3 grid place-items-center">
            <q-btn
              round
              flat
              @click="
                item.productQuantity--;
                update(item.productId, item.productName, item.productQuantity, item.productPrice);
              "
              icon="remove"
            />
            <q-input v-model="item.productQuantity" type="number" style="max-width: 50px" dense />
            <q-btn
              round
              flat
              @click="
                item.productQuantity++;
                update(item.productId, item.productName, item.productQuantity, item.productPrice);
              "
              icon="add"
            />
          </div>

          <div>{{ item.amount }}</div>
          <!--can be a component-->
        </div>

        <q-separator class="my-3" />

        <div dense class="grid-cols-3 grid place-items-center">
          <div class="mr-8">Subtotal</div>
          <div></div>

          <div>{{ subTotal }}</div>

          <div class="mr-3">Delivery fee</div>
          <div></div>

          <div>{{ fee }}</div>
        </div>

        <q-separator class="my-3" />

        <div dense class="grid-cols-3 grid place-items-center">
          <div class="font-bold mr-14">Total</div>
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
        <q-btn @click="reset()" class="mt-10" unelevated rounded color="primary" label="Place Order" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import { address as add } from 'src/api/settings';
import { cart, total, subTotal, updateCart, removeProduct, resetCart, itemsInCart } from 'src/api/cart';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const address = ref('');
    const fee = ref(0);
    const quasar = useQuasar();
    const router = useRouter();

    onMounted(() => {
      address.value = add.value;
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

    const reset = async () => {
      if (itemsInCart.value !== 0) {
        await resetCart();
        router.push('/order');
      }
    };

    return {
      model: ref(null),
      options: ['Cash-on-Delivery'],
      headers: ['General Items', 'Quantity', 'Amount'],
      address,
      cart,
      subTotal,
      total,
      fee,
      update,
      resetCart,
      reset,
      printCart: () => console.log(cart.value),
    };
  },
};
</script>
