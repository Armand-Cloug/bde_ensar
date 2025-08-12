import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  const role = (session?.user as any)?.role;
  const isAdherent = (session?.user as any)?.isAdherent;

  // Si connecté ET pas admin ET adherent => on bloque
  if (session?.user && role !== "admin" && isAdherent === true) {
    redirect("/"); // ou "/account" si tu préfères
  }

  // ✅ Autorisé (non connecté, ou connecté non-adherent, ou admin)
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white text-black">
      <h1 className="text-4xl font-bold mb-4">🏠 Page ADHESION BDE ENSAR</h1>
      <p className="text-lg text-gray-700">
        Love is the death of duty, and sometimes, duty is the death of love
      </p>
    </main>
  );
}
