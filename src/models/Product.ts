export interface Product {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  price: number;
  metadata?: any;
  isPrescriptionRequired: boolean;
  photoUrl?: any;
  dateUpdated?: any;
  dateCreated: Date;
  [x: string]: any;
}
