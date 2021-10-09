import { Notify } from 'quasar';
import { ref } from 'vue';
import { getDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { getAuth } from '@firebase/auth';
import { firestore } from './firebase';
import { CartItem } from 'src/models/CartItem';

const auth = getAuth();
const uid = auth.currentUser?.uid;

export const itemsInCart = ref(0);

export const addToCart = async (
  productId: string,
  productName: string,
  productQuantity: number,
  productPrice: number
) => {
  try {
    // const ref = doc(firestore, 'users', uid, 'cart');
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
  } catch (err) {
    Notify.create(`An error occured: ${(err as Error).message}`);
    return false;
  }
};

export const getCart = async (): Promise<Record<string, CartItem>> => {
  try {
    const user = auth.currentUser;
    if (user !== null) {
      const cart = (await getDoc(doc(firestore, `users/${uid}`))).data()!.cart;
      return cart ?? {};
    }
    return {};
  } catch (err) {
    Notify.create(`An error occured: ${(err as Error).message}`);
    return {};
  }
};

onSnapshot(doc(firestore, `users/${uid}`), (doc) => {
  const data = doc.data()!;
  const cart = data.cart as Record<string, CartItem>;
  let total = 0;
  for (const productId in cart) total += cart[productId].productQuantity;
  itemsInCart.value = total;
});
