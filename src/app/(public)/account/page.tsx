// app/account/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import EditFieldMenu from "@/components/account/EditFieldMenu";
import ChangePasswordButton from "@/components/account/ChangePasswordButton";
import RequestAlumniButton from "@/components/account/RequestAlumniButton";
import SignOutButton from "@/components/account/SignOutButton";
import { Sparkles } from "lucide-react";

function initials(first?: string | null, last?: string | null) {
  const f = (first ?? "").trim()[0] ?? "";
  const l = (last ?? "").trim()[0] ?? "";
  return (f + l).toUpperCase() || "U";
}

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/sign-in");

  const user = await db.user.findUnique({
    where: { id: String(session.user.id) },
    select: {
      firstName: true,
      lastName: true,
      email: true,
      image: true,
      promotion: true,
      birthdate: true,
      company: true,
      role: true,
      isAlumni: true,
    },
  });
  if (!user) redirect("/sign-in");

  const rows: Array<{
    key: "firstName" | "lastName" | "promotion" | "birthdate" | "company" | "role" | "email";
    label: string;
    value: string;
    editable?: boolean;
  }> = [
    { key: "firstName", label: "Prénom", value: user.firstName ?? "—", editable: true },
    { key: "lastName",  label: "Nom",    value: user.lastName  ?? "—", editable: true },
    { key: "email",     label: "Email",  value: user.email     ?? "—" },
    { key: "promotion", label: "Promotion", value: user.promotion ?? "—", editable: true },
    {
      key: "birthdate",
      label: "Date de naissance",
      value: user.birthdate ? new Date(user.birthdate as any).toLocaleDateString("fr-FR") : "—",
      editable: true,
    },
    { key: "company", label: "Entreprise", value: user.company ?? "—", editable: true },
    { key: "role",    label: "Rôle",       value: user.role ?? "—" },
  ];

  return (
    <main className="relative px-4 md:px-6 max-w-4xl mx-auto py-10 md:py-14">
      {/* Décor doux orange */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-20 h-[320px] w-[320px] rounded-full bg-orange-200/40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-10 h-[280px] w-[280px] rounded-full bg-amber-200/40 blur-3xl"
      />

      <Card className="relative overflow-hidden border bg-white shadow-sm">
        <CardHeader className="pb-3">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium text-orange-700 bg-orange-50 border-orange-100">
            <Sparkles className="h-3.5 w-3.5" />
            Mon profil
          </span>

          {/* Titre + Avatar */}
          <div className="mt-4 flex items-start gap-4">
            <Avatar className="h-16 w-16 ring-2 ring-orange-200">
              <AvatarImage src={user.image ?? undefined} alt="Photo de profil" />
              <AvatarFallback className="bg-orange-100 text-orange-700">
                {initials(user.firstName, user.lastName)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <CardTitle className="text-2xl">Mon compte</CardTitle>
              <p className="text-sm text-muted-foreground truncate">
                Connecté en tant que {user.email}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Actions */}
          <div className="flex flex-wrap gap-2 mb-4">
            <RequestAlumniButton isAlumni={user.isAlumni} />
            <ChangePasswordButton />
            <SignOutButton />
          </div>

          {/* Tableau d'infos */}
          <div className="rounded-lg border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-orange-50/40">
                  <TableHead className="w-56">Champ</TableHead>
                  <TableHead>Valeur</TableHead>
                  <TableHead className="w-12 text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.key}>
                    <TableCell className="font-medium">{r.label}</TableCell>
                    <TableCell>{r.value}</TableCell>
                    <TableCell className="text-right">
                      {r.editable ? (
                        <EditFieldMenu field={r.key as any} currentValue={r.value} />
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
