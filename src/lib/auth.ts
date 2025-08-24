// src/lib/auth.ts
import { db } from "@/lib/db";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: { signIn: "/sign-in" },
  events: {
    async signIn({ user }) {
      try {
        await db.user.update({
          where: { id: String(user.id) },
          data: { lastLoginAt: new Date() },
        });
      } catch (_) {/* noop */}
    },
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: { email: { label: "email", type: "email" }, password: { label: "password", type: "password" } },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await db.user.findUnique({ where: { email: credentials.email } });
        if (!user?.password) return null;
        const ok = await compare(credentials.password, user.password);
        if (!ok) return null;
        return { id: user.id, email: user.email };
      },
    }),
  ],

  callbacks: {
    // 🔁 IMPORTANT : on synchronise le token avec la DB régulièrement
    async jwt({ token, user }) {
      // 1) Au login, on hydrate depuis "user"
      if (user) {
        const dbUser = await db.user.findUnique({ where: { id: String((user as any).id ?? token.id) } });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.isAdherent = dbUser.isAdherent;
          token.adhesionStart = dbUser.adhesionStart?.toISOString();
          token.adhesionEnd = dbUser.adhesionEnd?.toISOString();
        }
      }

      // 2) À chaque requête, on resynchronise depuis la DB (léger site → OK)
      if (token?.id) {
        const dbUser = await db.user.findUnique({ where: { id: String(token.id) } });
        if (dbUser) {
          token.role = dbUser.role;
          token.isAdherent = dbUser.isAdherent;
          token.adhesionStart = dbUser.adhesionStart?.toISOString();
          token.adhesionEnd = dbUser.adhesionEnd?.toISOString();
        }
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: String(token.id),
        role: (token as any).role ?? null,
        isAdherent: Boolean((token as any).isAdherent),
        adhesionStart: (token as any).adhesionStart ? new Date((token as any).adhesionStart) : null,
        adhesionEnd: (token as any).adhesionEnd ? new Date((token as any).adhesionEnd) : null,
      } as any;
      return session;
    },
  },
};
