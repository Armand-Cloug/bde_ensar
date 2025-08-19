import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { compare, hash } from "bcrypt";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { currentPassword, newPassword } = await req.json();

  if (!newPassword || newPassword.length < 8) {
    return NextResponse.json({ error: "Mot de passe trop court" }, { status: 400 });
  }

  const user = await db.user.findUnique({ where: { id: String(session.user.id) } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (user.password) {
    // un mot de passe existe déjà -> vérifier l'actuel
    if (!currentPassword) {
      return NextResponse.json({ error: "Mot de passe actuel requis" }, { status: 400 });
    }
    const ok = await compare(currentPassword, user.password);
    if (!ok) return NextResponse.json({ error: "Mot de passe actuel incorrect" }, { status: 400 });
  }
  // Si pas de mdp (comptes Google), on autorise directement la définition

  const hashed = await hash(newPassword, 10);
  await db.user.update({
    where: { id: user.id },
    data: { password: hashed },
  });

  return NextResponse.json({ ok: true });
}
