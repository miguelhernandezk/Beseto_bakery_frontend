import { Product } from './Product';

export interface User {
  readonly _id: string;
  name: string;
  middleName: string;
  lastName: string;
  birthday: Date;
  role: 'admin' | 'editor' | 'customer' | 'superuser';
  email: string;
  password: string;
  phone: string;
  cart: UserCartItemDto[];
  isVerified: boolean;
  isActive: boolean;
}

export interface UserSignin {
  access_token: string;
  user: User;
}

export interface CartItemDto {
  product: string;
  amount: number;
}

export interface CartItem {
  product: Product;
  amount: number;
}
