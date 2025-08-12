import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string | null;
      first_name?: string | null;
      last_name?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string | number; // adapte au type de ton Prisma (string ou number)
    role?: string | null;
    first_name?: string | null;
    last_name?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string | null;
  }
}

export {};
