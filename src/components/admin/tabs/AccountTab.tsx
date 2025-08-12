'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { AdminUser } from "@/components/admin/AdminPanel";

function initials(first?: string | null, last?: string | null) {
  const f = (first ?? "").trim()[0] ?? "";
  const l = (last ?? "").trim()[0] ?? "";
  return (f + l).toUpperCase() || "U";
}

export default function AccountTab({ user }: { user: AdminUser }) {
  const rows = [
    { label: "Prénom", value: user.firstName ?? "—" },
    { label: "Nom", value: user.lastName ?? "—" },
    { label: "Email", value: user.email ?? "—" },
    { label: "Promotion", value: user.promotion ?? "—" },
    {
      label: "Date de naissance",
      value: user.birthdate ? new Date(user.birthdate as any).toLocaleDateString("fr-FR") : "—",
    },
    { label: "Entreprise", value: user.company ?? "—" },
    { label: "Rôle", value: user.role ?? "—" },
  ];

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarImage src={user.image ?? undefined} alt="Photo de profil" />
            <AvatarFallback>{initials(user.firstName, user.lastName)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">Mon compte</CardTitle>
            <p className="text-sm text-muted-foreground">
              Connecté en tant que {user.email ?? "—"}
            </p>
          </div>
        </div>
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
  );
}
