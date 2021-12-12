// import { api } from 'src/boot/axios';
// import { cart } from './cart';
import { hasActiveDelivery } from './delivery';
import { Notify } from 'quasar';

export const placeOrder = () => {
  if (hasActiveDelivery) {
    Notify.create({
      message: 'You cannot place an order while you have an active delivery!',
      type: 'negative',
    });
    throw new Error('You cannot place an order while you have an active delivery!');
    // return;
  }

  // TODO: Actually place an order
};
