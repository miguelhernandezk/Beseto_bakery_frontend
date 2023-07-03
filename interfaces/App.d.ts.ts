import { Dispatch, SetStateAction } from 'react';
import { CartItem } from './User';

export interface SharedStateContext {
  cart: CartItem[];
  setCart: Dispatch<SetStateAction<CartItem[]>>;
  notifyError: (msg: string) => void;
  notifySuccess: (msg: string) => void;
  addToCart: (token: string, productId: string, amount = 1) => Promise<void>;
  removeFromCart: (
    token: string,
    productId: string,
    amount = 1
  ) => Promise<void>;
}
