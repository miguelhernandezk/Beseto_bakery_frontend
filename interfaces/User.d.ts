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
  acces_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic3VwZXJ1c2VyIiwiaWF0IjoxNjc5NzI3NzQzLCJleHAiOjE2ODA1OTE3NDN9.1tOgNwPrgjWAHUSG5GJpoug2-SAiuaCaWFrerwzYM6w';
  user: User;
}

export enum Role {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
  EDITOR = 'editor',
  SUPERUSER = 'superuser',
}
