<template>
  <div dense class="relative grid-cols-3 grid place-items-center rounded-xl p-4 hover:bg-gray-200">
    <!--can be a component-->
    <div v-ripple dense class="relative font-black p-4" @click="$router.push(`/product/${modelValue.productId}`)">
      {{ modelValue.productName }}
    </div>

    <div class="grid-cols-3 grid place-items-center">
      <q-btn round flat @click="updateItemQuantity(-1)" icon="remove" />
      <q-input disable type="number" style="max-width: 50px" dense :model-value="modelValue.productQuantity" />
      <q-btn round flat @click="updateItemQuantity(1)" icon="add" />
    </div>

    <div class="font-black">{{ transformPrice(modelValue.productQuantity * modelValue.productPrice) }}</div>
    <!--can be a component-->
  </div>
</template>

<script lang="ts">
import { CartItem } from 'src/models/CartItem';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CartItem',
  inject: ['transformPrice'],
  props: {
    modelValue: {
      type: Object as () => CartItem,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, ctx) {
    // Implement v-model
    const updateItemQuantity = (increment: number) => {
      ctx.emit('update:modelValue', {
        productId: props.modelValue.productId,
        productName: props.modelValue.productName,
        productQuantity: props.modelValue.productQuantity + increment,
        productPrice: props.modelValue.productPrice,
      });
    };

    return {
      updateItemQuantity,
    };
  },
});
</script>
