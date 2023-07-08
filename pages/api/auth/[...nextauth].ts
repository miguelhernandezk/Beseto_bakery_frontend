import NextAuth from 'next-auth';
import type { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { login } from '../../../services/auth';
import {
  BackendError,
  CustomAxiosErrorData,
} from '../../../interfaces/Responses';

export const authOptions: NextAuthOptions = {
  theme: { colorScheme: 'dark' },
  debug: true,
  session: {},
  jwt: {},
  pages: {
    signIn: '/signin',
  },
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: {
          label: 'Correo',
          type: 'text',
          placeholder: 'ejemplo@gmail.com',
        },
        password: {
          label: 'Contraseña',
          type: 'password',
          placeholder: '******',
        },
      },
      async authorize(credentials) {
        if (credentials) {
          const res = await login(credentials?.username, credentials?.password);
          if (res.error) {
            const errorhelperText = res.helperText;
            if (
              errorhelperText ===
              'The request was made and the server responded with a status code that falls out of the range of 2xx'
            ) {
              const errorInfo: CustomAxiosErrorData<BackendError> = res.data;
              if (
                errorInfo.data?.message.includes(
                  'Por favor confirma tu dirección de correo electrónico antes de poder iniciar sesión.'
                )
              )
                throw new Error(JSON.stringify(errorInfo.data.message));
              return null;
            } else if (
              errorhelperText?.includes(
                'The request was made but no response was received'
              )
            ) {
              throw new Error(
                'Estamos teneiendo problemas temporalmente. Por favor contacta a soporte.'
              );
            }
            return null;
          } else {
            const user: User = await res.data;
            if (user) {
              return user;
            }
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      // session.user = token;
      return { ...session, ...token };
    },
  },
};
export default NextAuth(authOptions);
