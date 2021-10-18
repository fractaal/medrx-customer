<template>
  <q-card v-ripple class="shadow-lg h-62 w-40">
    <q-item>
      <q-item-section>
        <q-item-label class="font-bold" lines="1">{{ name }}</q-item-label>
        <q-item-label caption lines="1">{{ description }}</q-item-label>
      </q-item-section>
    </q-item>
    <q-img :src="photoUrl || placeholderImageUrl" ratio="1" class="h-30" />
    <q-item>
      <q-item-section>
        <q-item-label class>
          <span class="font-bold pr-1">{{ price }}</span
          >PHP
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-card>
</template>

<script>
import { defineComponent } from 'vue';
import { placeholderImageUrl } from 'src/api/storage';

export default defineComponent({
  name: 'ProductCard',
  props: {
    name: String,
    description: String,
    price: Number,
    photoUrl: String,
  },
  setup() {
    return {
      placeholderImageUrl,
    };
  },
});
</script>
