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
  isVerified: boolean;
  isActive: boolean;
}

export interface UserSignin {
  access_token: string;
  user: User;
}

export enum Role {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
  EDITOR = 'editor',
  SUPERUSER = 'superuser',
}
