import { api } from 'src/boot/axios';
import { ResponseData } from 'src/models/ResponseData';
import { Product } from 'src/models/Product';

export const submitTranscription = (prescriptionId: string, transcription: Record<string, Product>) => {
  return api.post<ResponseData<Record<string, Product>>>(`/transcription/${prescriptionId}`, { transcription });
};
