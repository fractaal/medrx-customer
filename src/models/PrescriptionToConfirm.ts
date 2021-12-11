import { CartItem } from './CartItem';

export interface PrescriptionToConfirm {
  id: string;
  userId: string;
  dateUpdated?: any;
  dateCreated: Date;
  products: CartItem[];
  isValid: boolean;
  isConfirmed: boolean;
  dateSubmitted: Date;
  dateConfirmedOrCancelled?: any;
  extraRemarks: string;
}
