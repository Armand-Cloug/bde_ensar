// app/(public)/anal/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import AnalBrowser from "@/components/anal/AnalBrowser";

export const dynamic = "force-dynamic";

export default async function AnalPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  // Guard: adhérent OU admin
  if (!user) redirect(`/sign-in?callbackUrl=${encodeURIComponent("/anal")}`);
  const isAdmin = user?.role === "admin";
  const isAdherent = Boolean(user?.isAdherent);
  if (!isAdmin && !isAdherent) {
    redirect("/adhesion?reason=anal");
  }

  // Chargement de l'arbre complet (ordonné) pour le navigateur de cours
  const formations = await db.formation.findMany({
    orderBy: { nom: "asc" },
    include: {
      semestres: {
        orderBy: { semestre: "asc" }, // ex. S5, S6
        include: {
          ues: {
            orderBy: { ueNumber: "asc" },
            include: {
              matieres: {
                orderBy: { nomMatiere: "asc" },
                include: {
                  cours: {
                    orderBy: { createdAt: "desc" },
                    select: {
                      id: true,
                      title: true,
                      description: true,
                      filePath: true,
                      createdAt: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return (
    <main className="px-4 md:px-6 max-w-6xl mx-auto w-full py-10 space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl md:text-4xl font-bold">
          Cours & Annales <span className="text-orange-600">(adhérents)</span>
        </h1>
        <p className="text-muted-foreground">
          Parcours les formations, choisis un semestre, puis ouvre l’UE et la matière
          pour télécharger les supports.
        </p>
      </header>

      <AnalBrowser data={JSON.parse(JSON.stringify(formations))} />
    </main>
  );
}
