<template>
  <q-page>
    <q-spinner class="w-1/2 mx-auto" v-if="isLoading" size="96px" />
    <div class="flex mt-16" v-else>
      <q-img
        :src="vendorData?.vendor.photoUrl || placeholderImageUrl"
        ratio="1"
        class="w-full md:w-1/2 rounded-none md:rounded-xl shadow-md"
      ></q-img>
      <div class="mt-4 md:mt-0 divide-y divide-gray-300 px-8 space-y-4 w-full md:w-1/2">
        <div>
          <p class="text-h6 font-black">{{ vendorData?.vendor.name }}</p>
          <div>{{ vendorData?.vendor.content }}</div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Data } from 'src/models/Vendor';
import { isLoading, getVendor } from 'src/api/vendor';
import { addToCart } from 'src/api/cart';
import { placeholderImageUrl } from 'src/api/storage';

export default defineComponent({
  name: 'ProductPage',
  setup() {
    const router = useRouter();
    const vendorId = router.currentRoute.value.params.id;
    const vendorData = ref<Data | null>(null);

    onMounted(async () => {
      vendorData.value = await getVendor(vendorId as string);
    });

    return {
      placeholderImageUrl,
      addToCart,
      isLoading,
      vendorData,
    };
  },
});
</script>
