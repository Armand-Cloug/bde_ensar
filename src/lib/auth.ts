import { db } from "@/lib/db";
import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },

  pages: {
    signIn: "/sign-in",
    newUser: "/onboarding", // redirige les nouveaux comptes ici
  },

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await db.user.findUnique({
          where: { email: credentials.email },
          select: { id: true, email: true, password: true },
        });
        if (!user?.password) return null;

        const ok = await compare(credentials.password, user.password);
        if (!ok) return null;

        return { id: String(user.id), email: user.email };
      },
    }),
  ],

  // Pré-remplit prénom/nom pour les nouveaux comptes Google
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      if (isNewUser && account?.provider === "google" && user?.id) {
        const p = profile as Record<string, any> | null;
        await db.user.update({
          where: { id: String(user.id) },
          data: {
            firstName: p?.given_name ?? null,
            lastName:  p?.family_name ?? null,
          },
        });
      }
    },
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) token.id = String(user.id);
      if (!("id" in token) && token.sub) (token as any).id = token.sub; // fallback
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: (token as any).id ?? token.sub ?? "",
        },
      };
    },
  },
};
