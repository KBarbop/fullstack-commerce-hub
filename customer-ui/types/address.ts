export interface Address {
  address:{
    street: string;
    streetNumber: string;
    zipCode: string;
    city: string;
    bellName: string;
    fullAddress: string;
    // floor:string;
    isSaved?:boolean;
    _id?: string;
  }
}


export interface FetchedAddress {
  street: string;
  streetNumber: string;
  zipCode: string;
  city: string;
  bellName: string;
  fullAddress: string;
  // floor:string;
  isSaved?:boolean;
  _id?: string;
}