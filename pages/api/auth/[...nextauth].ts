import axios from 'axios';
import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { ServicesResponse } from '../../../interfaces/Responses';
import { User } from '../../../interfaces/User';
import { login } from '../../../services/auth';

const options: AuthOptions = {
  theme: {
    colorScheme: 'auto', // "auto" | "dark" | "light"
    brandColor: '', // Hex color code
    logo: '', // Absolute URL to image
    buttonText: '', // Hex color code
  },
  debug: true,
  session: {},
  jwt: {},
  providers: [
    CredentialsProvider({
      name: 'Beseto',
      credentials: {
        username: {
          type: 'text',
          label: 'Email:',
          placeholder: 'tucorreo@ejemplo.com',
        },
        password: {
          type: 'password',
          label: 'Contraseña:',
        },
      },
      async authorize(credentials) {
        if (credentials === null || credentials === undefined) {
          return null;
        }
        if (
          credentials.password !== null &&
          credentials.password !== undefined &&
          credentials.username !== null &&
          credentials.username !== undefined
        ) {
          const loginResponse: ServicesResponse = await login(
            credentials?.username,
            credentials?.password
          );
          if (loginResponse.error) {
            return null;
          } else {
            const user: User = loginResponse.data;
            return user;
          }
        }
        return null;
      },
    }),
  ],
};

export default NextAuth(options);
