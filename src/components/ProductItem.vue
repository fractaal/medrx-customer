<template>
  <q-item clickable v-ripple class="rounded-xl shadow-lg py-4 bg-white">
    <div v-if="isSkeleton" class="w-full">
      <div class="flex flex-nowrap w-full">
        <q-skeleton class="i" type="rect" height="75px" width="75px" v-if="isSkeleton" />
        <div class="px-4 w-full">
          <q-skeleton type="text" height="18px" :width="Math.random() * 25 + 10 + '%'" v-if="isSkeleton" />
          <q-skeleton type="text" height="18px" :width="Math.random() * 25 + 25 + '%'" v-if="isSkeleton" />
          <q-skeleton type="text" height="18px" :width="Math.random() * 25 + 25 + '%'" v-if="isSkeleton" />
          <q-skeleton type="text" height="18px" :width="Math.random() * 25 + 25 + '%'" v-if="isSkeleton" />
        </div>
      </div>
    </div>

    <q-item-section avatar v-if="!isSkeleton">
      <q-img :src="photoUrl || placeholderImageUrl" ratio="1" class="rounded-md h-16 w-16" />
    </q-item-section>

    <q-item-section v-if="!isSkeleton">
      <q-item-label class="font-black">{{ itemname }}</q-item-label>
      <q-item-label>{{ description }}</q-item-label>
    </q-item-section>

    <q-item-section v-if="!isSkeleton" side class="font-semibold">
      <q-item-label class="font-black">{{ transformPrice(price) }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { placeholderImageUrl } from 'src/api/storage';

export default defineComponent({
  name: 'ProductItem',
  inject: ['transformPrice'],
  props: {
    isSkeleton: {
      type: Boolean,
      require: true,
    },
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
