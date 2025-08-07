import { Prisma } from "@prisma/client";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "@/lib/db";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/sign-in',
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const existingUser = await db.user.findUnique({
          where: { email: credentials.email }
        });

        if (!existingUser || !existingUser.password) {
          return null;
        }

        const passwordMatch = await compare(credentials.password, existingUser.password);
        if (!passwordMatch) {
          return null;
        }

        return {
          id: existingUser.id + '',
          email: existingUser.email,
        };
      }
    })
  ],
  callbacks: {  
    async jwt({ token, user, account, profile, isNewUser }) {
      return token;
    },
    async session({ session, user, token }) {
      return session;
    },
  }
};
