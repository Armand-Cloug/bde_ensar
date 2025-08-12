// lib/auth.ts
import { db } from "@/lib/db";
import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/sign-in", newUser: "/onboarding" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "Credentials",
      credentials: { email: { label: "email", type: "email" }, password: { label: "password", type: "password" } },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await db.user.findUnique({
          where: { email: credentials.email },
          select: { id: true, email: true, password: true, role: true },
        });
        if (!user?.password) return null;
        const ok = await compare(credentials.password, user.password);
        if (!ok) return null;
        return { id: String(user.id), email: user.email, role: user.role ?? "utilisateur" } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id ?? token.sub;
        token.role = (user as any).role ?? token.role;
        token.isAdherent = (user as any).isAdherent ?? token.isAdherent; // ✅
      }
      if (token.sub && token.isAdherent === undefined) {
        const u = await db.user.findUnique({
          where: { id: String(token.sub) },
          select: { isAdherent: true },
        });
        token.isAdherent = u?.isAdherent ?? false;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = (token as any).id ?? "";
      session.user.role = (token as any).role ?? null;
      session.user.isAdherent = (token as any).isAdherent ?? false; // ✅
      return session;
    }
  },
};
