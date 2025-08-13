// app/admin/bde/[id]/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import AddMemberButton from "@/components/admin/bde/AddMemberButton";
import MemberRowActions from "@/components/admin/bde/MemberRowActions";

function initials(f?: string | null, l?: string | null) {
  const a = (f ?? "").trim()[0] ?? "";
  const b = (l ?? "").trim()[0] ?? "";
  return (a + b).toUpperCase() || "U";
}

export default async function BdeDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/sign-in");
  if (session.user.role !== "admin") redirect("/");

  const team = await db.bdeTeam.findUnique({
    where: { id },
    include: {
      members: {
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true, email: true, image: true },
          },
        },
        orderBy: [{ poste: "asc" }],
      },
      _count: { select: { members: true } },
    },
  });

  if (!team) redirect("/admin");

  return (
    <main className="px-4 py-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button asChild variant="outline">
          <Link href="/admin">← Retour admin</Link>
        </Button>
      </div>

      {/* Infos équipe */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Équipe BDE {team.annee}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Créée le {new Date(team.createdAt).toLocaleDateString("fr-FR")} — {team._count.members} membre(s)
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {team.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={team.image}
              alt={`Photo de groupe ${team.annee}`}
              className="w-full max-h-100 object-cover rounded-lg border"
            />
          ) : null}
          <div className="prose max-w-none">
            <p>{team.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Liste membres */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Membres de l'équipe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Membre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Poste</TableHead>
                  <TableHead className="w-10 text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {team.members.length ? (
                  team.members.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={m.user.image ?? undefined} alt="avatar" />
                            <AvatarFallback>
                              {initials(m.user.firstName, m.user.lastName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="leading-tight">
                            <div className="font-medium">
                              {m.user.firstName ?? "—"} {m.user.lastName ?? ""}
                            </div>
                            <div className="text-xs text-muted-foreground">#{m.id.slice(0, 8)}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{m.user.email ?? "—"}</TableCell>
                      <TableCell>{m.poste}</TableCell>
                      <TableCell className="text-right">
                        <MemberRowActions teamId={team.id} memberId={m.id} userId={m.user.id} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      Aucun membre pour cette équipe
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Bouton en bas aussi si tu veux double accès */}
          <div className="mt-4 flex justify-end">
            <AddMemberButton teamId={team.id} />
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
