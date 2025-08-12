// app/account/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SignOutButton from "@/components/SignOutButton";

function initials(first?: string | null, last?: string | null) {
  const f = (first ?? "").trim()[0] ?? "";
  const l = (last ?? "").trim()[0] ?? "";
  return (f + l).toUpperCase() || "U";
}

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/sign-in");

  // Récupère l'utilisateur en DB
  const user = await db.user.findUnique({
    where: { id: String(session.user.id) },
    select: {
      firstName: true,
      lastName: true,
      email: true,
      image: true,        // si ton modèle Prisma a bien ce champ
      promotion: true,
      birthdate: true,    // Date | string | null
      company: true,
      role: true,
    },
  });

  if (!user) redirect("/sign-in");

  const rows = [
    { label: "Prénom", value: user.firstName ?? "—" },
    { label: "Nom", value: user.lastName ?? "—" },
    { label: "Email", value: user.email ?? "—" },
    { label: "Promotion", value: user.promotion ?? "—" },
    {
      label: "Date de naissance",
      value: user.birthdate
        ? new Date(user.birthdate as any).toLocaleDateString("fr-FR")
        : "—",
    },
    { label: "Entreprise", value: user.company ?? "—" },
    { label: "Rôle", value: user.role ?? "—" },
  ];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white text-black px-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarImage src={user.image ?? undefined} alt="Photo de profil" />
              <AvatarFallback>{initials(user.firstName, user.lastName)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">
                Mon compte
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Connecté en tant que {user.email}
              </p>
            </div>
          </div>
          <SignOutButton />
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-56">Champ</TableHead>
                <TableHead>Valeur</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.label}>
                  <TableCell className="font-medium">{r.label}</TableCell>
                  <TableCell>{r.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
