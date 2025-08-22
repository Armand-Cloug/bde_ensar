'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  id: string;          // eventId
  onSaved: () => void; // optionnel si tu veux rafraîchir ailleurs
};

export default function EventPageDialog({ open, onOpenChange, id, onSaved }: Props) {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);

  // slug affiché en lecture seule si déjà créé
  const [slug, setSlug] = React.useState<string | null>(null);
  // on édite un texte simple (pas de HTML)
  const [content, setContent] = React.useState<string>("");

  React.useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const res = await fetch(`/api/admin/events/${id}/page`);
        if (!res.ok) throw new Error('Chargement impossible');
        const json = await res.json();
        const page = json.page;
        setSlug(page?.slug ?? null);
        setContent(page?.contentHtml ?? ""); // on stocke du texte dans contentHtml
      } catch (e: any) {
        toast({ title: 'Erreur', description: e.message, variant: 'destructive' });
        onOpenChange(false);
      }
    })();
  }, [open, id, toast, onOpenChange]);

  async function save() {
    if (!content.trim()) {
      toast({ title: 'Contenu requis', description: 'Merci de renseigner un contenu (texte).' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/events/${id}/page`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }), // ⬅️ on envoie juste "content"
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error ?? 'Sauvegarde impossible');
      }
      const data = await res.json().catch(() => ({}));
      if (data?.slug) setSlug(data.slug); // si page nouvellement créée, slug renvoyé
      onSaved();
      toast({ title: 'OK', description: 'Page enregistrée' });
      onOpenChange(false);
    } catch (e: any) {
      toast({ title: 'Erreur', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Gérer la page de l’évènement</DialogTitle>
        </DialogHeader>

        <div className="grid gap-3">
          {/* Affichage du slug si présent, sinon message info */}
          <div className="text-sm text-muted-foreground">
            {slug ? (
              <span>
                <span className="font-medium text-foreground">Slug :</span> {slug}
              </span>
            ) : (
              <span>Un slug (ex. <code className="px-1 rounded bg-muted">event-xxxxxxxx</code>) sera généré automatiquement à l’enregistrement.</span>
            )}
          </div>

          <div>
            <Label>Contenu (texte)</Label>
            <Textarea
              rows={10}
              placeholder="Décrivez le programme, les infos pratiques… (texte simple)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <Button onClick={save} disabled={loading} className="bg-amber-500 hover:bg-amber-600 text-white">
            {loading ? 'Enregistrement…' : 'Enregistrer la page'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
