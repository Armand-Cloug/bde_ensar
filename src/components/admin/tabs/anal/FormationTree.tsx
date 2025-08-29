'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { MoreHorizontal, FileDown } from 'lucide-react';

import { CreateSemestreDialog, CreateUeDialog, CreateMatiereDialog, CreateCoursDialog } from './CreateDialogs';
import type { FormationNode, SemestreNode, UeNode, MatiereNode, CoursNode } from './type';
import Section from './Section';

/* ---------- Racine ---------- */

export default function FormationTree({
  data,
  onChanged,
}: {
  data: FormationNode[];
  onChanged: () => void;
}) {
  return (
    <div className="space-y-4">
      {data.map((f) => (
        <FormationItem key={f.id} node={f} onChanged={onChanged} />
      ))}
    </div>
  );
}

/* ---------- Helper ligne ---------- */

function Row({
  left,
  right,
}: {
  left: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b last:border-0">
      <div className="min-w-0">{left}</div>
      {right ? <div className="ml-3 shrink-0">{right}</div> : null}
    </div>
  );
}

/* ---------- Formation ---------- */

function FormationItem({ node, onChanged }: { node: FormationNode; onChanged: () => void }) {
  const [openCreateSem, setOpenCreateSem] = React.useState(false);

  return (
    <Section
      title={
        <div className="flex items-center justify-between">
          <span className="truncate">{node.nom}</span>
          <FormationActions
            id={node.id}
            onChanged={onChanged}
            onAddSemestre={() => setOpenCreateSem(true)}
          />
        </div>
      }
    >
      {node.semestres.length ? (
        <div className="space-y-3">
          {node.semestres.map((s) => (
            <SemestreItem key={s.id} node={s} onChanged={onChanged} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Aucun semestre.</p>
      )}

      <CreateSemestreDialog
        formationId={node.id}
        open={openCreateSem}
        onOpenChange={setOpenCreateSem}
        onCreated={onChanged}
      />
    </Section>
  );
}

function FormationActions({
  id,
  onChanged,
  onAddSemestre,
}: {
  id: string;
  onChanged: () => void;
  onAddSemestre: () => void;
}) {
  const { toast } = useToast();

  async function rename() {
    const nom = prompt('Nouveau nom de formation ?');
    if (!nom) return;
    const res = await fetch(`/api/admin/anal/formations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom }),
    });
    if (!res.ok) {
      return toast({ title: 'Erreur', description: 'Renommage impossible', variant: 'destructive' });
    }
    onChanged();
  }

  async function remove() {
    if (!confirm('Supprimer la formation (et tout son contenu) ?')) return;
    const res = await fetch(`/api/admin/anal/formations/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      return toast({ title: 'Erreur', description: 'Suppression impossible', variant: 'destructive' });
    }
    onChanged();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Formation</DropdownMenuLabel>
        <DropdownMenuItem onClick={onAddSemestre}>+ Ajouter un semestre</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={rename}>Renommer</DropdownMenuItem>
        <DropdownMenuItem className="text-red-600" onClick={remove}>Supprimer</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ---------- Semestre ---------- */

function SemestreItem({ node, onChanged }: { node: SemestreNode; onChanged: () => void }) {
  const [openCreateUe, setOpenCreateUe] = React.useState(false);

  return (
    <Section
      title={
        <div className="flex items-center justify-between">
          <span>{node.semestre}</span>
          <SemestreActions
            id={node.id}
            onChanged={onChanged}
            onAddUe={() => setOpenCreateUe(true)}
          />
        </div>
      }
    >
      {node.ues.length ? (
        <div className="space-y-3">
          {node.ues.map((u) => (
            <UeItem key={u.id} node={u} onChanged={onChanged} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Aucune UE.</p>
      )}

      <CreateUeDialog
        semestreId={node.id}
        open={openCreateUe}
        onOpenChange={setOpenCreateUe}
        onCreated={onChanged}
      />
    </Section>
  );
}

function SemestreActions({
  id,
  onChanged,
  onAddUe,
}: {
  id: string;
  onChanged: () => void;
  onAddUe: () => void;
}) {
  const { toast } = useToast();

  async function rename() {
    const semestre = prompt('Nouveau libellé de semestre ? (ex: S5)');
    if (!semestre) return;
    const res = await fetch(`/api/admin/anal/semestres/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ semestre }),
    });
    if (!res.ok) {
      return toast({ title: 'Erreur', description: 'Renommage impossible', variant: 'destructive' });
    }
    onChanged();
  }

  async function remove() {
    if (!confirm('Supprimer ce semestre (et son contenu) ?')) return;
    const res = await fetch(`/api/admin/anal/semestres/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      return toast({ title: 'Erreur', description: 'Suppression impossible', variant: 'destructive' });
    }
    onChanged();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Semestre</DropdownMenuLabel>
        <DropdownMenuItem onClick={onAddUe}>+ Ajouter une UE</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={rename}>Renommer</DropdownMenuItem>
        <DropdownMenuItem className="text-red-600" onClick={remove}>Supprimer</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ---------- UE ---------- */

function UeItem({ node, onChanged }: { node: UeNode; onChanged: () => void }) {
  const [openCreateMatiere, setOpenCreateMatiere] = React.useState(false);

  return (
    <Section
      title={
        <div className="flex items-center justify-between">
          <span>UE{node.ueNumber}{node.nomUe ? ` — ${node.nomUe}` : ''}</span>
          <UeActions
            id={node.id}
            onChanged={onChanged}
            onAddMatiere={() => setOpenCreateMatiere(true)}
          />
        </div>
      }
    >
      {node.matieres.length ? (
        <div className="space-y-3">
          {node.matieres.map((m) => (
            <MatiereItem key={m.id} node={m} onChanged={onChanged} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Aucune matière.</p>
      )}

      <CreateMatiereDialog
        ueId={node.id}
        open={openCreateMatiere}
        onOpenChange={setOpenCreateMatiere}
        onCreated={onChanged}
      />
    </Section>
  );
}

function UeActions({
  id,
  onChanged,
  onAddMatiere,
}: {
  id: string;
  onChanged: () => void;
  onAddMatiere: () => void;
}) {
  const { toast } = useToast();

  async function rename() {
    const ueNumber = Number(prompt('Nouveau numéro d’UE ? (1–5)') ?? '');
    if (!ueNumber || ueNumber < 1 || ueNumber > 5) return;
    const nomUe = prompt('Nouveau nom d’UE ? (facultatif)') ?? null;

    const res = await fetch(`/api/admin/anal/ues/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ueNumber, nomUe }),
    });
    if (!res.ok) {
      return toast({ title: 'Erreur', description: 'Mise à jour UE impossible', variant: 'destructive' });
    }
    onChanged();
  }

  async function remove() {
    if (!confirm('Supprimer cette UE (et son contenu) ?')) return;
    const res = await fetch(`/api/admin/anal/ues/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      return toast({ title: 'Erreur', description: 'Suppression impossible', variant: 'destructive' });
    }
    onChanged();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>UE</DropdownMenuLabel>
        <DropdownMenuItem onClick={onAddMatiere}>+ Ajouter une matière</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={rename}>Modifier (n° / nom)</DropdownMenuItem>
        <DropdownMenuItem className="text-red-600" onClick={remove}>Supprimer</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ---------- Matière ---------- */

function MatiereItem({ node, onChanged }: { node: MatiereNode; onChanged: () => void }) {
  const [openCreateCours, setOpenCreateCours] = React.useState(false);

  return (
    <Section
      title={
        <div className="flex items-center justify-between">
          <span>{node.nomMatiere}</span>
          <MatiereActions
            id={node.id}
            onChanged={onChanged}
            onAddCours={() => setOpenCreateCours(true)}
          />
        </div>
      }
    >
      {node.cours.length ? (
        <div className="space-y-2">
          {node.cours.map((c) => (
            <CoursRow key={c.id} node={c} onChanged={onChanged} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Aucun cours.</p>
      )}

      <CreateCoursDialog
        matiereId={node.id}
        open={openCreateCours}
        onOpenChange={setOpenCreateCours}
        onCreated={onChanged}
      />
    </Section>
  );
}

function MatiereActions({
  id,
  onChanged,
  onAddCours,
}: {
  id: string;
  onChanged: () => void;
  onAddCours: () => void;
}) {
  const { toast } = useToast();

  async function rename() {
    const nomMatiere = prompt('Nouveau nom de matière ?');
    if (!nomMatiere) return;
    const res = await fetch(`/api/admin/anal/matieres/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nomMatiere }),
    });
    if (!res.ok) {
      return toast({ title: 'Erreur', description: 'Renommage impossible', variant: 'destructive' });
    }
    onChanged();
  }

  async function remove() {
    if (!confirm('Supprimer cette matière (et ses cours) ?')) return;
    const res = await fetch(`/api/admin/anal/matieres/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      return toast({ title: 'Erreur', description: 'Suppression impossible', variant: 'destructive' });
    }
    onChanged();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Matière</DropdownMenuLabel>
        <DropdownMenuItem onClick={onAddCours}>+ Ajouter un cours (upload)</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={rename}>Renommer</DropdownMenuItem>
        <DropdownMenuItem className="text-red-600" onClick={remove}>Supprimer</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ---------- Cours ---------- */

function CoursRow({ node, onChanged }: { node: CoursNode; onChanged: () => void }) {
  const { toast } = useToast();

  async function rename() {
    const title = prompt('Nouveau titre de cours ?', node.title ?? '');
    if (!title) return;
    const description = prompt('Nouvelle description ? (facultatif)', node.description ?? '') ?? null;

    const res = await fetch(`/api/admin/anal/cours/${node.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    });
    if (!res.ok) {
      return toast({ title: 'Erreur', description: 'Mise à jour impossible', variant: 'destructive' });
    }
    onChanged();
  }

  async function remove() {
    if (!confirm('Supprimer ce cours (fichier inclus) ?')) return;
    const res = await fetch(`/api/admin/anal/cours/${node.id}`, { method: 'DELETE' });
    if (!res.ok) {
      return toast({ title: 'Erreur', description: 'Suppression impossible', variant: 'destructive' });
    }
    onChanged();
  }

  return (
    <Row
      left={
        <div className="min-w-0">
          <div className="font-medium truncate">{node.title}</div>
          <div className="text-xs text-muted-foreground truncate">{node.description ?? '—'}</div>
          <a
            href={node.filePath}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs text-orange-700 hover:underline mt-1"
          >
            <FileDown className="h-3.5 w-3.5" /> Télécharger
          </a>
        </div>
      }
      right={
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={rename}>Modifier</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600" onClick={remove}>Supprimer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      }
    />
  );
}
