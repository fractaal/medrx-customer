<template>
  <div
    class="relative shadow-lg p-4 border rounded-lg"
    :class="order.isActive ? 'border-medrx' : 'border-gray-200'"
    v-ripple
    @click="toggleExpand"
  >
    <p class="text-lg font-black">Order {{ formatDistanceToNow(new Date(order.dateCreated), { addSuffix: true }) }}</p>
    <p class="font-medium">{{ order.products.length }} product(s)</p>
    <q-slide-transition>
      <div v-show="isExpanded" class="mt-2 space-y-2">
        <div
          @click="$router.push('/product/' + product.productId)"
          v-for="product in order.products"
          :key="product.productId"
          class="p-4 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-200"
        >
          <span class="flex justify-between"
            ><p class="font-medium">{{ product.productQuantity }} pc.</p>
            <p class="font-black ml-2">{{ product.productName }}</p>
            <p class="ml-auto">
              {{ transformPrice(product.productPrice) }} PER ITEM<br />
              {{ transformPrice(parseInt(product.productPrice) * parseInt(product.productQuantity)) }} TOTAL
            </p></span
          >
        </div>
      </div>
    </q-slide-transition>
    <q-badge class="m-4" floating v-if="order.isActive"> ACTIVE </q-badge>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { formatDistanceToNow } from 'date-fns';

export default defineComponent({
  name: 'OrderItem',
  inject: ['transformPrice'],
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const isExpanded = ref(false);

    return {
      isExpanded,
      toggleExpand: () => (isExpanded.value = !isExpanded.value),
      formatDistanceToNow,
    };
  },
});
</script>
