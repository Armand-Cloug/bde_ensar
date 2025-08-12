import { db } from "@/lib/db";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
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

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),

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
        
        if(existingUser.password) {
          const passwordMatch = await compare(credentials.password, existingUser.password);
          if (!passwordMatch) {
            return null;
          }
        }

        return {
          id: existingUser.id + '',
          email: existingUser.email,
        };
      }
    })
  ],
  callbacks: {  
    async jwt({ token, user }) {
      if(user) {  
        return {
          ...token,
          id: user.id,
        }
      }
      return token;  
    },
    
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
        },
      };
    },
  }
};
