import { ref } from 'vue';
import { api } from 'src/boot/axios';
import { ResponseData } from 'src/models/ResponseData';
import { Product } from 'src/models/Product';
import { CartItem } from 'src/models/CartItem';
import { Notify } from 'quasar';

// TODO: Rename this to just prescription submissions so that the serverside code naming makes sense.

let lastCreatedPrescriptionUserId: string | null = null;

const resetTranscription = () => {
  transcription.value = {
    userId: '',
    cartItems: [],
    extraRemarks: '',
  };
};

export const transcription = ref({
  userId: '',
  cartItems: [] as CartItem[],
  extraRemarks: '',
});

export const addItemToTranscription = (product: Product) => {
  if (transcription.value.cartItems.find((item) => item.productId === product.id)) {
    Notify.create({ type: 'negative', message: 'This product is already in the cart!' });
    return;
  }

  const cartItem = {
    productId: product.id,
    productName: product.name,
    productQuantity: 1,
    productPrice: product.price,
  };
  transcription.value.cartItems.push(cartItem);
};

export const removeItemFromTranscription = (product: Product) => {
  const index = transcription.value.cartItems.findIndex((cartItem) => cartItem.productId === product.id);
  transcription.value.cartItems.splice(index, 1);
};

export const createTranscriptionForUser = (userId: string, force = false) => {
  if (lastCreatedPrescriptionUserId === userId && !force) {
    return;
  }
  resetTranscription();
  transcription.value.userId = userId;
  lastCreatedPrescriptionUserId = userId;
};

export const submitTranscription = async () => {
  if (transcription.value.cartItems.length === 0) {
    Notify.create({ type: 'negative', message: 'Please add at least one product to the cart!' });
    return;
  }

  if (transcription.value.userId === '') {
    Notify.create({ type: 'negative', message: 'Please select a user!' });
    return;
  }

  return api.post<ResponseData<Record<string, Product>>>(`/transcription/${transcription.value.userId}`, {
    transcription: transcription.value,
  });
};
