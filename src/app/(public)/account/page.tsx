// src/app/(public)/account/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import EditFieldMenu from "@/components/account/EditFieldMenu";
import ChangePasswordButton from "@/components/account/ChangePasswordButton";
import RequestAlumniButton from "@/components/account/RequestAlumniButton";
import SignOutButton from "@/components/account/SignOutButton";
import DeleteAccountButton from "@/components/account/DeleteAccountButton";

function initials(first?: string | null, last?: string | null) {
  const f = (first ?? "").trim()[0] ?? "";
  const l = (last ?? "").trim()[0] ?? "";
  return (f + l).toUpperCase() || "U";
}

type FieldKey =
  | "firstName"
  | "lastName"
  | "promotion"
  | "birthdate"
  | "company"
  | "role"
  | "email"
  | "isAdherent"
  | "isAlumni"
  | "lastLoginAt";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

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
      isAdherent: true,
      lastLoginAt: true,
    },
  });

  if (!user) {
    redirect("/sign-in");
  }

  const rows: Array<{
    key: FieldKey;
    label: string;
    value: string;
    editable?: boolean;
  }> = [
    { key: "firstName", label: "Prénom", value: user.firstName ?? "—", editable: true },
    { key: "lastName", label: "Nom", value: user.lastName ?? "—", editable: true },
    { key: "email", label: "Email", value: user.email ?? "—" },
    { key: "promotion", label: "Promotion", value: user.promotion ?? "—", editable: true },
    {
      key: "birthdate",
      label: "Date de naissance",
      value: user.birthdate ? new Date(user.birthdate as unknown as string).toLocaleDateString("fr-FR") : "—",
      editable: true,
    },
    { key: "company", label: "Entreprise", value: user.company ?? "—", editable: true },
    { key: "role", label: "Rôle", value: user.role ?? "—" },

    { key: "isAdherent", label: "Adhérent", value: user.isAdherent ? "Oui" : "Non" },
    { key: "isAlumni", label: "Alumni", value: user.isAlumni ? "Oui" : "Non" },

    {
      key: "lastLoginAt",
      label: "Dernière connexion",
      value: user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString("fr-FR") : "—",
    },
  ];

  return (
    <main className="min-h-[calc(80vh-64px)] flex-1 flex flex-col items-center bg-white text-black px-4 py-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarImage src={user.image ?? undefined} alt="Photo de profil" />
            <AvatarFallback>{initials(user.firstName, user.lastName)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <CardTitle className="text-2xl">Mon compte</CardTitle>
            <p className="text-sm text-muted-foreground truncate">
              Connecté en tant que {user.email}
            </p>
          </div>
        </CardHeader>

        <CardContent>
          {/* Actions sous le header */}
          <div className="flex flex-wrap gap-2 mb-4">
            {/* ✅ Assure-toi que RequestAlumniButton a: type Props = { isAlumni?: boolean } */}
            <RequestAlumniButton isAlumni={user.isAlumni} />
            <ChangePasswordButton />
            <SignOutButton />
            <DeleteAccountButton />
          </div>

          {/* Tableau des infos */}
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
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
                        // Si EditFieldMenu attend un type plus strict, on peut garder ce cast.
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
