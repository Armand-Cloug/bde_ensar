import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  // Pas connecté → page de connexion
  if (!session?.user) {
    redirect("/sign-in");
  }

  const role = (session.user as any)?.role;
  const isAdherent = (session.user as any)?.isAdherent;

  // Connecté mais pas adhérent et pas admin → vers adhésion
  if (role !== "admin" && !isAdherent) {
    redirect("/adhesion");
  }

  // ✅ Autorisé
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white text-black">
      <h1 className="text-4xl font-bold mb-4">🏠 Page ANAL BDE ENSAR</h1>
      <p className="text-lg text-gray-700">
        Never forget what you are. The rest of the world will not
      </p>
    </main>
  );
}
