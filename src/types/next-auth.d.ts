// types/next-auth.d.ts  (ou src/types/next-auth.d.ts)
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string | null;
      isAdherent?: boolean; // ✅
      first_name?: string | null;
      last_name?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string | number;
    role?: string | null;
    isAdherent?: boolean; // ✅
    first_name?: string | null;
    last_name?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string | null;
    isAdherent?: boolean; // ✅
  }
}

export {};

