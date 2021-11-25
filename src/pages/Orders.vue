<template>
  <q-page>
    <p v-if="ordersIsLoading">loading</p>
    <div class="shadow-lg p-4" v-for="order in orders" :key="order.id">
      {{ order }}
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import * as orders from 'src/api/orders';

export default defineComponent({
  name: 'Orders',
  setup() {
    onMounted(() => {
      orders.getOrders();
    });

    return {
      ...orders,
    };
  },
});
</script>
