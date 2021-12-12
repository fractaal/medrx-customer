<template>
  <q-page class="px-4 sm:px-0">
    <medrx-loader v-if="ordersIsLoading" style="height: calc(100vh - 150px)" />
    <order-item v-for="order in orders" :key="order.id" :order="order" />
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import * as orders from 'src/api/orders';
import { formatDistanceToNow } from 'date-fns';

import MedrxLoader from 'src/components/MedrxLoader.vue';
import OrderItem from 'src/components/OrderItem.vue';

export default defineComponent({
  name: 'Orders',
  components: { MedrxLoader, OrderItem },
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
