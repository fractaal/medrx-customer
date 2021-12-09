import { Dialog, LocalStorage } from 'quasar';
import CoordinateSelectorDialog from 'src/components/CoordinateSelectorDialog.vue';
import { Location } from 'src/models/Location';

/**
 * Get the local delivery location of this user
 * @returns {Location}
 */
export const getDeliveryLocation = () => {
  const location: Location = LocalStorage.getItem('deliveryLocation');
  if (location?.lat && location?.lng) {
    return location;
  }
  return null;
};

/**
 * Set the delivery location locally for this user
 * @param location lat and long coords
 */
export const setDeliveryLocation = (location: Location) => {
  LocalStorage.set('deliveryLocation', location);
};

/**
 * Prompts for a delivery location, but DOES NOT set it.
 * @returns {Promise<Location>}
 */
export const promptForDeliveryLocation = () => {
  return new Promise<Location>((resolve) => {
    Dialog.create({
      component: CoordinateSelectorDialog,
      componentProps: {
        titleText: 'Select a location',
        descriptionText: 'Tell us where we need to deliver orders.',
        confirmText: 'Deliver here',
        cancelText: 'Cancel',
        initialCoordinates: getDeliveryLocation() ?? undefined,
      },
    })
      .onOk((location) => {
        // setDeliveryLocation(location);
        resolve(location);
      })
      .onCancel(() => {
        // setDeliveryLocation(null);
        resolve(null);
      });
  });
};

export const promptForDeliveryLocationAndSet = async () => {
  const location = await promptForDeliveryLocation();
  if (location) {
    setDeliveryLocation(location);
    return location;
  }
};

/**
 * Get the user's delivery location, but if the existing one is null, prompt the user to set one.
 */
export const getOrPromptForDeliveryLocation = async () => {
  const location = getDeliveryLocation();
  if (location) {
    return location;
  }
  return await promptForDeliveryLocationAndSet();
};
