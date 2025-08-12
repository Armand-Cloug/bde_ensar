import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import AdminPanel from "@/components/admin/AdminPanel";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/sign-in");
  if (session.user.role !== "admin") redirect("/");

  const user = await db.user.findUnique({
    where: { id: String(session.user.id) },
    select: {
      firstName: true,   // ⬅️
      lastName: true,    // ⬅️
      email: true,
      image: true,
      promotion: true,
      birthdate: true,
      company: true,
      role: true,
    },
  });

  if (!user) redirect("/sign-in");
  return <AdminPanel user={user} />;
}
