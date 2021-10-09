<template>
  <q-card v-ripple class="shadow-lg" style="width: 12rem; min-width: 12rem">
    <q-item>
      <q-item-section>
        <q-item-label class="text-2xl">{{ name }}</q-item-label>
        <q-item-label caption lines="1">{{ description }}</q-item-label>
      </q-item-section>
    </q-item>
    <img src="https://cdn.quasar.dev/img/parallax2.jpg" />
    <q-item>
      <q-item-section>
        <q-item-label class>
          <span class="font-black text-2xl pr-1">{{ price }}</span
          >PHP
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-card>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ProductCard',
  props: {
    name: String,
    description: String,
    price: Number,
  },
});
</script>
