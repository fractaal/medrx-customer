<template>
  <q-item-label class="font-black" overline>TRANSCRIBE PRESCRIPTION</q-item-label>
  <q-btn label="Add a new item" @click="newItem" />
  <div v-for="(item, idx) in items" :key="item.productId">
    <product-autocomplete v-model="items[idx]" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { LocalStorage, Dialog } from 'quasar';
import { useRouter } from 'vue-router';
import ReturnPrescriptionDialog from 'src/components/ReturnPrescriptionDialog.vue';
import ProductAutocomplete from 'src/components/ProductAutocomplete.vue';
import { CartItem } from 'src/models/CartItem';

export default defineComponent({
  name: 'PharmacistView',
  components: {
    ProductAutocomplete,
    // ReturnPrescriptionDialog,
  },
  setup() {
    const items = ref<Partial<CartItem>[]>([]);

    const newItem = () => {
      items.value.push({
        productId: '',
        productName: '',
        productQuantity: 1,
        productPrice: 0,
      });
    };

    return {
      newItem,
      items,
    };
  },
});
</script>
