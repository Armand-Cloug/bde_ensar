import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST() {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Récupère tous les adhérents actuels
  const adherents = await db.user.findMany({
    where: { isAdherent: true },
    select: { firstName: true, lastName: true, email: true, id: true },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  });

  // Si aucun, renvoyer un petit fichier indiquant "aucun"
  if (adherents.length === 0) {
    const content = "Aucun adhérent à réinitialiser.\n";
    const filename = `adherents-reset-${new Date().toISOString().slice(0,10)}.txt`;
    return new Response(content, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  }

  // Réinitialise l’adhésion
  await db.user.updateMany({
    where: { isAdherent: true },
    data: {
      isAdherent: false,
      adhesionStart: null,
      adhesionEnd: null,
    },
  });

  // Compose le fichier texte (Nom Prénom — email)
  const lines = adherents.map((u: any) => {
    const name = `${u.lastName ?? ""} ${u.firstName ?? ""}`.trim() || "(sans nom)";
    const email = u.email ?? "(sans email)";
    return `${name} — ${email}`;
  });
  const content = [
    `Adhérents réinitialisés le ${new Date().toLocaleString("fr-FR")}`,
    `Total: ${adherents.length}`,
    "",
    ...lines,
    "",
  ].join("\n");

  const filename = `adherents-reset-${new Date().toISOString().slice(0,10)}.txt`;
  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
