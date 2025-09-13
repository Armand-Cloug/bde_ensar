// src/middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export const config = {
  // Le middleware ne s'applique qu'aux routes admin
  matcher: ["/admin/:path*"],
};

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Pas connecté → redirige vers /sign-in en gardant la destination
  if (!token) {
    const signIn = new URL("/sign-in", req.url);
    signIn.searchParams.set("next", url.pathname + url.search);
    return NextResponse.redirect(signIn);
  }

  // Connecté mais pas admin → home
  if ((token as any).role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Admin → OK
  return NextResponse.next();
}
