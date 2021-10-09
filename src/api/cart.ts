export const updateCart = async (name: string, quantity: number, price: number) => {
  console.log('Added to cart', name, quantity, price);
  const auth = getAuth();
  const uid = auth.currentUser?.uid;

  try {
    const ref = doc(collection(firestore, 'users'), uid);
    await setDoc(
      ref,
      {
        cart: [{ name: name, quantity: quantity, price: price }],
      },
      { merge: true }
    );

    return true;
  } catch (err) {
    Notify.create(`An error occured: ${(err as Error).message}`);
    return false;
  }
};

export const getCart = async () => {
  const auth = getAuth();

  try {
    // For easy access to all user info, store in object each one

    const user = auth.currentUser;

    if (user !== null) {
      const cart = (await getDoc(doc(collection(firestore, 'users'), user.uid))).data()!.cart;
      return cart;
    }
    return null;
  } catch (err) {
    Notify.create(`An error occured: ${(err as Error).message}`);
  }
};
