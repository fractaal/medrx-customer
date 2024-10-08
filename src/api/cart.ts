import { Notify, Dialog } from 'quasar';
import { ref } from 'vue';
import { getDoc, doc, updateDoc, onSnapshot, deleteField } from 'firebase/firestore';
import { getAuth } from '@firebase/auth';
import { firestore } from './firebase';
import { CartItem } from 'src/models/CartItem';

const auth = getAuth();
const uid = auth.currentUser?.uid;

export const itemsInCart = ref(0);
export const cart = ref<Record<string, CartItem>>({});
export const fee = ref(0);
export const subTotal = ref(0);
export const total = ref(0);

export const addToCart = (productId: string, productName: string, productQuantity: number, productPrice: number) => {
  try {
    Dialog.create({
      persistent: true,
      cancel: 'No',
      ok: 'Yes',
      title: "You're sure?",
      message: `Add ${productQuantity} of ${productName} to your cart?`,
    }).onOk(async () => {
      const ref = doc(firestore, `users/${uid}`);
      const existingQuantity: number = (await getDoc(ref)).get(`cart.${productId}.productQuantity`) ?? 0;

      await updateDoc(ref, `cart.${productId}`, {
        productId,
        productName,
        productPrice,
        productQuantity: existingQuantity + productQuantity,
      });

      console.log('Added to cart', productName, productQuantity, productPrice);
      Notify.create({ message: `${productName} has been added to the cart!`, type: 'positive' });
      return true;
    });
  } catch (err) {
    Notify.create(`An error occured: ${(err as Error).message}`);
    return false;
  }
};

export const removeProduct = async (productId: string) => {
  try {
    const user = auth.currentUser;
    const uid = auth.currentUser?.uid;

    if (user !== null) {
      const ref = doc(firestore, `users/${uid}`);
      await updateDoc(ref, { [`cart.${productId}`]: deleteField() });
    }
  } catch (err) {
    Notify.create(`An error occured: ${(err as Error).message}`);
    return false;
  }
};

export const resetCart = async () => {
  try {
    const user = auth.currentUser;
    const uid = auth.currentUser?.uid;

    if (user !== null) {
      const ref = doc(firestore, `users/${uid}`);
      await updateDoc(ref, { cart: 0 });
      await updateDoc(ref, { subTotal: 0 });
    }
  } catch (err) {
    Notify.create(`An error occured: ${(err as Error).message}`);
    return false;
  }
};

/* TODO: Refactor this to only update the cart once the
 * user has left the page. That way, we don't update the cart
 * every time the user modifies quantity, wasting resources.
 **/

export const updateCart = async (
  productId: string,
  productName: string,
  productQuantity: number | string,
  productPrice: number | string
) => {
  if (typeof productQuantity === 'string') {
    productQuantity = parseInt(productQuantity);
  }

  if (typeof productPrice === 'string') {
    productPrice = parseInt(productPrice);
  }

  try {
    const user = auth.currentUser;
    const uid = auth.currentUser?.uid;

    if (user !== null) {
      const ref = doc(firestore, `users/${uid}`);

      await updateDoc(ref, `cart.${productId}`, {
        productId,
        productName,
        productPrice,
        productQuantity,
      });
    }
  } catch (err) {
    Notify.create(`An error occured: ${(err as Error).message}`);
    return false;
  }
};

// Calculates computed attributes on cart change
onSnapshot(doc(firestore, `users/${uid}`), (doc) => {
  const data = doc.data()!;
  const _cart = data.cart as Record<string, CartItem>;
  let _itemsInCart = 0;
  let _subTotal = 0;
  let _total = 0;

  for (const productId in _cart) {
    const itemSubtotal = _cart[productId].productQuantity * _cart[productId].productPrice;
    // _cart[productId].amount = itemSubtotal;
    _subTotal += itemSubtotal;
    _total = _subTotal + fee.value;

    _itemsInCart += parseInt(_cart[productId].productQuantity as unknown as string);
  }

  subTotal.value = _subTotal;
  total.value = _total;
  itemsInCart.value = _itemsInCart;

  const orderedCart = Object.keys(_cart)
    .sort()
    .reduce((obj: Record<string, CartItem>, key) => {
      obj[key] = _cart[key];
      return obj;
    }, {});

  cart.value = orderedCart;
});
