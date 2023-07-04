import { Product } from './Product';
import { User } from './User';

export interface Order {
  _id: string;
  createdBy: User;
  finalCustomer: User;
  createdOn: Date;
  immediateSale: boolean;
  cart: CartItemInOrder[];
  address: string;
  status: 'abierto' | 'entregado' | 'cancelado';
  paymentMethod: 'credit/debit card' | 'paypal' | 'cash' | 'other';
  total: number;
  totalWithDiscount: number;
  deliveryDate: Date;
  customerInstructions: string;
}

export interface CartItemInOrder {
  product: Product;
  amount: number;
  currentPrice: number;
}

export interface CreateOrderDto {
  createdBy: string;
  finalCustomer: string;
  createdOn: Date;
  immediateSale: boolean;
  cart: CartItemInOrderDto[];
  address: string;
  status: 'abierto' | 'entregado' | 'cancelado';
  paymentMethod: 'credit/debit card' | 'paypal' | 'cash' | 'other';
  total: number;
  totalWithDiscount: number;
  deliveryDate: Date;
  customerInstructions: string;
}

export interface CartItemInOrderDto {
  product: string;
  amount: number;
  currentPrice: number;
}
