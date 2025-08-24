"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, BookOpen, Search } from "lucide-react";

type Cours = {
  id: string;
  title: string;
  description: string | null;
  filePath: string;
  createdAt: string;
};

type Matiere = {
  id: string;
  nomMatiere: string;
  cours: Cours[];
};

type Ue = {
  id: string;
  ueNumber: number;  // 1..5
  nomUe: string | null;
  matieres: Matiere[];
};

type Semestre = {
  id: string;
  semestre: string; // "S5", "S6" ...
  ues: Ue[];
};

type Formation = {
  id: string;
  nom: string;
  semestres: Semestre[];
};

export default function AnalBrowser({ data }: { data: Formation[] }) {
  const [formationId, setFormationId] = React.useState<string>(data[0]?.id ?? "");
  const currentFormation = React.useMemo(
    () => data.find((f) => f.id === formationId) ?? data[0],
    [formationId, data]
  );

  const semestres = currentFormation?.semestres ?? [];
  const [semestreId, setSemestreId] = React.useState<string>(semestres[0]?.id ?? "");
  React.useEffect(() => {
    // Réinitialise le semestre quand on change de formation
    setSemestreId(semestres[0]?.id ?? "");
  }, [formationId]); // eslint-disable-line

  const currentSemestre = React.useMemo(
    () => semestres.find((s) => s.id === semestreId) ?? semestres[0],
    [semestres, semestreId]
  );

  const [q, setQ] = React.useState("");

  const filteredUEs = React.useMemo(() => {
    if (!currentSemestre) return [];
    const query = q.trim().toLowerCase();
    if (!query) return currentSemestre.ues;

    // Filtre sur UE / matière / cours
    return currentSemestre.ues
      .map((ue) => {
        const filteredMatieres = ue.matieres
          .map((m) => {
            const filteredCours = m.cours.filter(
              (c) =>
                c.title.toLowerCase().includes(query) ||
                (c.description ?? "").toLowerCase().includes(query)
            );
            if (
              m.nomMatiere.toLowerCase().includes(query) ||
              filteredCours.length > 0
            ) {
              return { ...m, cours: filteredCours.length ? filteredCours : m.cours };
            }
            return null;
          })
          .filter(Boolean) as Matiere[];

        if (
          `ue${ue.ueNumber}`.includes(query) ||
          (ue.nomUe ?? "").toLowerCase().includes(query) ||
          filteredMatieres.length > 0
        ) {
          return { ...ue, matieres: filteredMatieres.length ? filteredMatieres : ue.matieres };
        }
        return null;
      })
      .filter(Boolean) as Ue[];
  }, [currentSemestre, q]);

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <div className="grid md:grid-cols-3 gap-3">
        <div>
          <label className="text-sm font-medium">Formation</label>
          <Select value={currentFormation?.id ?? ""} onValueChange={setFormationId}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Choisir une formation" />
            </SelectTrigger>
            <SelectContent>
              {data.map((f) => (
                <SelectItem key={f.id} value={f.id}>
                  {f.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium">Semestre</label>
          <Select
            value={currentSemestre?.id ?? ""}
            onValueChange={setSemestreId}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Semestre" />
            </SelectTrigger>
            <SelectContent>
              {semestres.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.semestre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium flex items-center gap-2">
            <Search className="h-4 w-4" /> Recherche
          </label>
          <Input
            className="mt-1"
            placeholder="Titre, description, UE, matière…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      {/* Résultats */}
      {!currentSemestre ? (
        <Card>
          <CardContent className="p-6 text-muted-foreground">
            Aucune donnée pour cette formation.
          </CardContent>
        </Card>
      ) : filteredUEs.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-muted-foreground">
            Aucun résultat. Essaie un autre semestre ou modifie ta recherche.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredUEs.map((ue) => (
            <section key={ue.id} className="rounded-2xl border bg-white shadow-sm">
              <div className="px-4 py-3 border-b flex items-center gap-3">
                <Badge className="bg-amber-100 text-orange-800 hover:bg-amber-100">
                  UE{ue.ueNumber}
                </Badge>
                <div className="font-semibold">
                  {ue.nomUe ? `${ue.nomUe}` : "Unité d’enseignement"}
                </div>
              </div>

              <div className="p-4">
                <Accordion type="multiple" className="w-full">
                  {ue.matieres.map((m) => (
                    <AccordionItem key={m.id} value={m.id}>
                      <AccordionTrigger className="text-base">
                        {m.nomMatiere}
                      </AccordionTrigger>
                      <AccordionContent>
                        {m.cours.length === 0 ? (
                          <p className="text-sm text-muted-foreground pl-1">
                            Aucun cours pour cette matière.
                          </p>
                        ) : (
                          <ul className="space-y-2">
                            {m.cours.map((c) => (
                              <li key={c.id} className="rounded-md border p-3">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <div className="font-medium flex items-center gap-2">
                                      <BookOpen className="h-4 w-4 text-orange-600" />
                                      <span className="truncate">{c.title}</span>
                                    </div>
                                    {c.description ? (
                                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                        {c.description}
                                      </p>
                                    ) : null}
                                    <p className="text-xs text-muted-foreground mt-1">
                                      Ajouté le {new Date(c.createdAt).toLocaleDateString("fr-FR")}
                                    </p>
                                  </div>

                                  <a
                                    href={c.filePath}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                                      <Download className="h-4 w-4 mr-1.5" />
                                      Télécharger
                                    </Button>
                                  </a>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
