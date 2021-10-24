import { Notify, Dialog } from 'quasar';
import { ref } from 'vue';
import { getDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { getAuth } from '@firebase/auth';
import { firestore } from './firebase';
import { CartItem } from 'src/models/CartItem';

const auth = getAuth();
const uid = auth.currentUser?.uid;

export const itemsInCart = ref(0);

export const addToCart = (productId: string, productName: string, productQuantity: number, productPrice: number) => {
  try {
    Dialog.create({
      persistent: true,
      cancel: 'No',
      ok: 'Yes',
      title: "You're sure?",
      message: `Add ${productQuantity} of ${productName} to your cart?`,
    }).onOk(async () => {
      // const ref = doc(firestore, 'users', uid, 'cart');
      const ref = doc(firestore, `users/${uid}`);

      const existingQuantity: number = (await getDoc(ref)).get(`cart.${productId}.productQuantity`) ?? 0;
      await updateDoc(ref, `cart.${productId}`, {
        productQuantity: existingQuantity + productQuantity,
      });
      const latestQuantity: number = (await getDoc(ref)).get(`cart.${productId}.productQuantity`) ?? 0;
      const subTotal: number = (await getDoc(ref)).get('subTotal') ?? 0;
      const latestPrice: number = latestQuantity * productPrice;
      const newSubTotal = latestPrice + subTotal;

      await updateDoc(ref, `cart.${productId}`, {
        productId,
        productName,
        productPrice,
        productQuantity: latestQuantity,
        amount: latestPrice
      });

      await updateDoc(ref, {
        subTotal: newSubTotal,
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

export const getTotal = async () => {
  try {
    const user = auth.currentUser;
    if (user !== null) {
      const subTotal = (await getDoc(doc(firestore, `users/${uid}`))).data()!.subTotal;
      return subTotal;
    }
    return 0;
  } catch (err) {
    Notify.create(`An error occured: ${(err as Error).message}`);
    return {};
  }
};

// export const updateCart = async (productId: string, productName: string, productQuantity: number, productPrice: number) => {
//   try {
//     const user = auth.currentUser;
//     const uid = auth.currentUser?.uid;

//     if (user !== null) {
//       const ref = doc(firestore, `users/${uid}`);
//       const currentPrice: number = (await getDoc(ref)).get(`cart.${productId}.productPrice`) ?? 0;

//       await updateDoc(ref, `cart.${productId}`, {
//         productId,
//         productName,
//         productPrice: productPrice,
//         productQuantity: latestQuantity,
//       });
//     }
//   }
// }

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
