<template>
  <q-item>
    <q-item-section top thumbnail class="q-ml-none">

      <q-avatar >
        <img :src="photoUrl || placeholderImageUrl" ratio="1" class="h-30" />
      </q-avatar>

    </q-item-section>
    
    <q-item-section>
      <q-item-label>{{ itemname }}</q-item-label>
      <q-item-label caption>{{ description }}</q-item-label>
    </q-item-section>

    <q-item-section side class="font-semibold">
      <q-item-label caption>{{ price }}</q-item-label>
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
