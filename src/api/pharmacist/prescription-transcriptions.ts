import { ref } from 'vue';
import { api } from 'src/boot/axios';
import { ResponseData } from 'src/models/ResponseData';
import { Product } from 'src/models/Product';
import { CartItem } from 'src/models/CartItem';

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

export const createTranscriptionForUser = (userId: string, force = false) => {
  if (lastCreatedPrescriptionUserId === userId && !force) {
    return;
  }
  resetTranscription();
  transcription.value.userId = userId;
  lastCreatedPrescriptionUserId = userId;
};

export const submitTranscription = () => {
  return api.post<ResponseData<Record<string, Product>>>(`/transcription/${transcription.value.userId}`, {
    transcription: transcription.value,
  });
};
