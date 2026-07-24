import { Product } from "./product";
import {Address, FetchedAddress} from "./address";

export interface OrderResponse {
    responseStatus: string;
    statusCode: number;
    data: {
      orders: Order[];
    };
  }
  
  export interface Order {
    _id: string;
    _user: string;
    products: Product[];
    status: string;
    timeReceived: string;
    timeCompleted: string | "N/A"; 
    address: FetchedAddress;
    totalPrice: string;
    estimatedTime: number;
    paymentWay: string;
  }