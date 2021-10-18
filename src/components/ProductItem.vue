<template>
  <!-- <q-item class="rounded-xl">
    <q-item-section top>
      <q-avatar>
        <img :src="photoUrl || placeholderImageUrl" ratio="1" />
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ itemname }}</q-item-label>
      <q-item-label caption>{{ description }}</q-item-label>
    </q-item-section>

    <q-item-section class="font-semibold">
      <q-item-label caption>{{ price }}</q-item-label>
    </q-item-section>
  </q-item> -->
  <q-item clickable v-ripple class="rounded-xl shadow-lg py-4 bg-white">
    <q-item-section avatar>
      <q-img :src="photoUrl || placeholderImageUrl" ratio="1" class="rounded-md h-16 w-16" />
    </q-item-section>

    <q-item-section>
      <q-item-label class="font-black">{{ itemname }}</q-item-label>
      <q-item-label>{{ description }}</q-item-label>
    </q-item-section>

    <q-item-section side class="font-semibold">
      <q-item-label class="font-black">{{ price }} PHP</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent } from 'vue';
import { placeholderImageUrl } from 'src/api/storage';

export default defineComponent({
  name: 'ProductItem',
  props: {
    itemname: String,
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
