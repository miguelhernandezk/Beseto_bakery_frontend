import { Product } from '../Product';

export interface CreateUserDto {
  name: string;
  middleName: string;
  lastName: string;
  birthday: Date;
  role: 'admin' | 'editor' | 'customer' | 'superuser';
  email: string;
  password: string;
  phone: string;
  cart: Product[];
}
