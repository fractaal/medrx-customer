export interface Product {
  id: number;
  vendorId: number;
  name: string;
  description: string;
  price: number;
  metadata?: any;
  isPrescriptionRequired: boolean;
  updatedAt?: any;
  createdAt: Date;
  [x: string]: any;
}
