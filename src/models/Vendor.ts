export interface Vendor {
  id: string;
  name: string;
  content: string;
  city: string;
  rating: number;
  photoUrl?: any;
  metadata?: any;
  dateUpdated?: any;
  dateCreated: Date;
}

export interface Result {
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
}

export interface Products {
  results: Result[];
  total: number;
}

export interface Data {
  vendor: Vendor;
  products: Products;
}
