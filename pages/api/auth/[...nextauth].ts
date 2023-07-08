import NextAuth from 'next-auth';
import type { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { login } from '../../../services/auth';

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
