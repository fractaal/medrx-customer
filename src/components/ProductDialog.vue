<template>
  <!-- Dialog showing product details and vendor info -->
  <q-dialog ref="dialogRef" @hide="onDialogHide" class="z-20">
    <q-card>
      <div v-if="product">
        <q-card-section>
          <q-toolbar>
            <q-toolbar-title>{{ product.name }}</q-toolbar-title>
            <q-btn icon="close" round @click="onCancelClick" flat />
          </q-toolbar>
          <div v-viewer>
            <q-img :src="product.photoUrl" fit="cover" :alt="product.name" />
          </div>
          <q-item-label class="mt-2 font-bold"
            ><p class="inline">{{ transformPrice(product.price) }}</p>
            <p class="inline float-right">{{ product.vendorName }}</p></q-item-label
          >
          <q-separator class="my-2" />
          <div>
            {{ product.description }}
          </div>
        </q-card-section>
      </div>
      <div v-else-if="!isLoading && !product">
        <div class="font-black text-xl">No product found</div>
        <p>Whoops...</p>
      </div>
      <q-card-actions>
        <slot />
      </q-card-actions>
      <div v-if="isLoading" class="p-16">
        <q-inner-loading :showing="isLoading">
          <q-spinner size="48px" />
        </q-inner-loading>
      </div>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useDialogPluginComponent } from 'quasar';
import { getProduct } from 'src/api/product';
import { Product } from 'src/models/Product';

export default defineComponent({
  name: 'ProductDialog',
  inject: ['transformPrice'],
  props: {
    productId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    // REQUIRED; must be called inside of setup()
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();
    // dialogRef      - Vue ref to be applied to QDialog
    // onDialogHide   - Function to be used as handler for @hide on QDialog
    // onDialogOK     - Function to call to settle dialog with "ok" outcome
    //                    example: onDialogOK() - no payload
    //                    example: onDialogOK({ /*.../* }) - with payload
    // onDialogCancel - Function to call to settle dialog with "cancel" outcome

    const product = ref<Product | null>(null);
    const isLoading = ref(false);

    onMounted(async () => {
      isLoading.value = true;

      // Get product on mount from props
      product.value = await getProduct(props.productId);

      isLoading.value = false;
    });

    return {
      product,
      isLoading,

      // This is REQUIRED;
      // Need to inject these (from useDialogPluginComponent() call)
      // into the vue scope for the vue html template
      dialogRef,
      onDialogHide,

      // other methods that we used in our vue html template;
      // these are part of our example (so not required)
      onOKClick() {
        onDialogOK();
        // on OK, it is REQUIRED to
        // call onDialogOK (with optional payload)
        // or with payload: onDialogOK({ ... })
        // ...and it will also hide the dialog automatically
      },

      // we can passthrough onDialogCancel directly
      onCancelClick: onDialogCancel,
    };
  },
});
</script>
