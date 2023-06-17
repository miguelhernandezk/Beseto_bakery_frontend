import { User } from './User';

declare module 'next-auth' {
  interface Session {
    access_token: string;
    exp: number;
    expires: string;
    iat: number;
    jti: string;
    user: User;
  }
}
