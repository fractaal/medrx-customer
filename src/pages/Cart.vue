<template>
  <div class="relative px-4 py-2 bg-white shadow-lg sm:rounded-3xl sm:p-20">
    <div class="mx-auto">
      <div>
        <q-item dense clickable v-ripple @click="printCart()" class="rounded-xl p-4">
          <q-item-section avatar top>
            <q-avatar icon="place" color="primary" text-color="white" />
          </q-item-section>

          <q-item-section
            @click="
              () => {
                $router.push('/settings').then(() => {
                  openDeliveryLocationSelectorDialog();
                });
              }
            "
          >
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

        <cart-item
          class="mb-2"
          v-for="(item, idx) in cart"
          :key="item"
          v-model="cart[idx]"
          @update:modelValue="onCartItemUpdate"
        />

        <q-separator class="my-3" />

        <div dense class="grid-cols-3 grid place-items-center">
          <div class="mr-8">Subtotal</div>
          <div></div>

          <div>{{ transformPrice(subTotal) }}</div>

          <div class="mr-3">Delivery fee</div>
          <div></div>

          <div>{{ transformPrice(fee) }}</div>
        </div>

        <q-separator class="my-3" />

        <div dense class="grid-cols-3 grid place-items-center">
          <div class="font-bold mr-14">Total</div>
          <div></div>

          <div>{{ transformPrice(total) }}</div>
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
import { placeOrder } from 'src/api/order';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

import CartItem from 'src/components/CartItem.vue';

export default {
  name: 'Cart',
  inject: ['transformPrice'],
  components: { CartItem },
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

    const reset = () => {
      if (itemsInCart.value !== 0) {
        try {
          placeOrder();
        } catch (err) {
          return;
        }
        resetCart();
        // router.push('/order');
      } else {
        quasar.notify({
          type: 'negative',
          message: 'Your cart is empty!',
        });
      }
    };

    const onCartItemUpdate = async ({
      productId,
      productName,
      productQuantity,
      productPrice,
    }: {
      productId: string;
      productName: string;
      productQuantity: number;
      productPrice: number;
    }) => {
      await update(productId, productName, productQuantity, productPrice);
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
      onCartItemUpdate,
      openDeliveryLocationSelectorDialog: () => {
        //@ts-ignore
        document.querySelector('#addressAndLocation').click();
      },
    };
  },
};
</script>
