// app/admin/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  // Pas connecté
  if (!session?.user) {
    redirect("/sign-in");
  }

  // Mauvais rôle
  if (session.user.role !== "admin") {
    redirect("/");
  }

  // ✅ Contenu inchangé
  return (
    <main className="">
      <h1 className="text-4xl font-bold mb-4">
        Welcome to Admin page {session?.user?.email}
      </h1>
      <p className="text-lg text-gray-700">I'm ROOT</p>
      <p className="text-lg text-gray-700">Compte : {session?.user?.email}</p>
    </main>
  );
}
