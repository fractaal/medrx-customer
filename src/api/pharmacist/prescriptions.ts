import { ref } from 'vue';
import { api } from 'src/boot/axios';
import { ResponseData } from 'src/models/ResponseData';
import { Product } from 'src/models/Product';
import { CartItem } from 'src/models/CartItem';
import { Notify } from 'quasar';

// TODO: Rename this to just prescription submissions so that the serverside code naming makes sense.

let lastCreatedPrescriptionUserId: string | null = null;

const resetPrescription = () => {
  prescription.value = {
    userId: '',
    cartItems: [],
    extraRemarks: '',
  };
};

export const prescription = ref({
  userId: '',
  cartItems: [] as CartItem[],
  extraRemarks: '',
});

export const addItemToPrescription = (product: Product) => {
  if (prescription.value.cartItems.find((item) => item.productId === product.id)) {
    Notify.create({ type: 'negative', message: 'This product is already in the cart!' });
    return;
  }

  const cartItem = {
    productId: product.id,
    productName: product.name,
    productQuantity: 1,
    productPrice: product.price,
  };
  prescription.value.cartItems.push(cartItem);
};

export const removeItemFromPrescription = (product: Product) => {
  const index = prescription.value.cartItems.findIndex((cartItem) => cartItem.productId === product.id);
  prescription.value.cartItems.splice(index, 1);
};

export const createPrescriptionForUser = (userId: string, force = false) => {
  if (lastCreatedPrescriptionUserId === userId && !force) {
    return;
  }
  resetPrescription();
  prescription.value.userId = userId;
  lastCreatedPrescriptionUserId = userId;
};

export const submitPrescription = async () => {
  if (prescription.value.cartItems.length === 0) {
    Notify.create({ type: 'negative', message: 'Please add at least one product to the cart!' });
    return;
  }

  if (prescription.value.userId === '') {
    Notify.create({ type: 'negative', message: 'Please select a user!' });
    return;
  }

  // TODO: This api call doesn't work yet, do some stuff with it
  return api.post<ResponseData<Record<string, Product>>>('/prescription', {
    userId: prescription.value.userId,
    products: prescription.value.cartItems.map((cartItem) => {
      return { productId: cartItem.productId, productQuantity: cartItem.productQuantity };
    }),
  });
};
