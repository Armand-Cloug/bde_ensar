// src/app/(dashboard)/admin/users/[id]/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import ChangePasswordButton from "@/components/admin/users/ChangePasswordButton";
import DeleteUserButton from "@/components/admin/users/DeleteUserButton";
import EditFieldMenu from "@/components/admin/users/EditFieldMenu";
import Link from "next/link";

function initials(f?: string | null, l?: string | null) {
  const a = (f ?? "").trim()[0] ?? "";
  const b = (l ?? "").trim()[0] ?? "";
  return (a + b).toUpperCase() || "U";
}
const fmtDay = (d?: Date | null) => (d ? new Date(d).toLocaleDateString("fr-FR") : "—");
const fmtDateTime = (d?: Date | null) =>
  d ? new Date(d).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" }) : "—";

export default async function UserDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>; // ⬅️ Next.js 15 : params est asynchrone
}) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/sign-in");
  if (session.user.role !== "admin") redirect("/");

  const user = await db.user.findUnique({
    where: { id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      name: true,
      email: true,
      image: true,
      role: true,
      isAdherent: true,
      isAlumni: true,
      promotion: true,
      birthdate: true,
      company: true,
      adhesionStart: true,
      adhesionEnd: true,
      createdAt: true,
    },
  });

  if (!user) redirect("/admin");

  // Lignes à afficher (les clés marquées editable auront le menu ⋯)
  const rows: Array<{
    key?: any;
    label: string;
    value: any;
    editable?: boolean;
  }> = [
    { key: "firstName", label: "Prénom", value: user.firstName ?? "—", editable: true },
    { key: "lastName", label: "Nom", value: user.lastName ?? "—", editable: true },
    { label: "Nom affiché", value: user.name ?? "—" },
    { label: "Email", value: user.email ?? "—" },

    {
      key: "role",
      label: "Rôle",
      value: user.role ?? "—",
      editable: true,
    },
    {
      key: "isAdherent",
      label: "Adhérent",
      value: (
        <Badge variant={user.isAdherent ? "default" : "secondary"}>
          {user.isAdherent ? "Oui" : "Non"}
        </Badge>
      ),
      editable: true,
    },
    {
      key: "isAlumni",
      label: "Alumni",
      value: (
        <Badge variant={user.isAlumni ? "default" : "secondary"}>
          {user.isAlumni ? "Oui" : "Non"}
        </Badge>
      ),
      editable: true,
    },
    { key: "promotion", label: "Promotion", value: user.promotion ?? "—", editable: true },
    {
      key: "birthdate",
      label: "Date de naissance",
      value: fmtDay(user.birthdate),
      editable: true,
    },
    { key: "company", label: "Entreprise", value: user.company ?? "—", editable: true },

    { label: "Début d'adhésion", value: fmtDay(user.adhesionStart) },
    { label: "Fin d'adhésion", value: fmtDay(user.adhesionEnd) },
    { label: "Créé le", value: fmtDateTime(user.createdAt) },
    { label: "ID", value: user.id },
  ];

  return (
    <main className="px-4 py-6 max-w-4xl mx-auto">
      <div className="mb-4 flex flex-wrap gap-2">
        <Button asChild variant="outline">
          <Link href="/admin">← Retour admin</Link>
        </Button>
        <ChangePasswordButton userId={id} />
        <DeleteUserButton userId={id} />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.image ?? undefined} alt="Photo de profil" />
              <AvatarFallback>{initials(user.firstName, user.lastName)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">
                {user.firstName ?? "—"} {user.lastName ?? ""}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{user.email ?? "—"}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-56">Champ</TableHead>
                  <TableHead>Valeur</TableHead>
                  <TableHead className="w-10 text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.label}>
                    <TableCell className="font-medium">{r.label}</TableCell>
                    <TableCell>{r.value as any}</TableCell>
                    <TableCell className="text-right">
                      {r.editable && (
                        <EditFieldMenu
                          userId={id}
                          field={r.key as any}
                          value={
                            r.key === "isAdherent"
                              ? user.isAdherent
                              : r.key === "isAlumni"
                              ? user.isAlumni
                              : r.key === "birthdate"
                              ? user.birthdate // c'est déjà un Date | null côté serveur
                              : (user as any)[r.key]
                          }
                        />
                      )}
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
