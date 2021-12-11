<template>
  <q-page>
    <medrx-loader v-if="ordersIsLoading" style="height: calc(100vh - 150px)" />
    <div
      v-else
      class="shadow-lg p-4 border rounded-lg"
      :class="order.isActive ? 'border-medrx' : 'border-gray-200'"
      v-for="order in orders"
      :key="order.id"
    >
      <q-toggle v-model="visible" />
      <p class="text-lg font-black">
        Order {{ formatDistanceToNow(new Date(order.dateCreated), { addSuffix: true }) }}
      </p>
      <p class="font-medium">{{ order.products.length }} product(s)</p>
      <q-slide-transition>
        <div v-show="visible" class="mt-2 space-y-2">
          <!-- {{ order.products }} -->
          <div
            @click="$router.push('/product/' + product.productId)"
            v-for="product in order.products"
            :key="product.productId"
            class="p-4 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-200"
          >
            <span class="flex justify-between"
              ><p class="font-medium">{{ product.productQuantity }} pc.</p>
              <p class="font-black ml-2">{{ product.productName }}</p>
              <p class="font-black ml-auto">{{ transformPrice(product.productPrice) }} total</p></span
            >
          </div>
        </div>
      </q-slide-transition>
      <q-badge class="m-4" floating v-if="order.isActive"> ACTIVE </q-badge>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import * as orders from 'src/api/orders';
import { formatDistanceToNow } from 'date-fns';

import MedrxLoader from 'src/components/MedrxLoader.vue';

export default defineComponent({
  name: 'Orders',
  components: { MedrxLoader },
  inject: ['transformPrice'],
  setup() {
    onMounted(() => {
      orders.getOrders();
    });

    return {
      ...orders,
      formatDistanceToNow,
      visible: ref(false),
    };
  },
});
</script>
