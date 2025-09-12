'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function ViewAdminsButton() {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);

  async function openAdminsWindow() {
    setLoading(true);
    const win = window.open('', '_blank', 'width=900,height=700');
    if (!win) {
      setLoading(false);
      toast({ title: 'Popup bloquée', description: 'Autorise les popups pour afficher la liste.', variant: 'destructive' });
      return;
    }

    try {
      win.document.write(`
        <!doctype html><html lang="fr"><head>
          <meta charset="utf-8" />
          <title>Administrateurs — BDE ENSAR</title>
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <style>
            body { font: 14px/1.5 system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, "Helvetica Neue", Arial; margin:0; background:#fff; color:#111; }
            header { padding:16px 20px; border-bottom:1px solid #eee; display:flex; justify-content:space-between; align-items:center; }
            h1 { font-size:18px; margin:0; }
            .badge { background:#FDE68A; color:#92400E; padding:2px 8px; border-radius:9999px; font-size:12px; border:1px solid #FCD34D; }
            .container { padding:16px 20px; }
            table { width:100%; border-collapse: collapse; }
            th, td { text-align:left; padding:10px 8px; border-bottom:1px solid #eee; }
            th { background:#fafafa; font-weight:600; }
            .muted { color:#6b7280; }
          </style>
        </head><body>
          <header>
            <h1>Administrateurs</h1>
            <span class="badge">BDE ENSAR</span>
          </header>
          <div class="container"><p>Chargement…</p></div>
        </body></html>
      `);
      win.document.close();

      // On demande explicitement les admins
      const res = await fetch('/api/admin/users?role=admin&page=1&pageSize=1000', { cache: 'no-store' });
      if (!res.ok) {
        win.document.querySelector('.container')!.innerHTML =
          `<p class="muted">Impossible de récupérer les administrateurs.</p>`;
        toast({ title: 'Erreur', description: 'Endpoint /api/admin/users indisponible.', variant: 'destructive' });
        return;
      }

      const json = await res.json().catch(() => ({}));
      let users: any[] = json?.users ?? [];

      // Sécurité supplémentaire : refiltrer si l’API a quand même renvoyé tout le monde
      users = users.filter((u) => (u.role ?? '').toLowerCase() === 'admin');

      const rows = users.map((u) => ({
        id: String(u.id ?? ''),
        firstName: u.firstName ?? '',
        lastName: u.lastName ?? '',
        email: u.email ?? '',
      }));

      const tbody = rows.map(
        (u) => `
          <tr>
            <td>${escapeHtml(`${u.firstName} ${u.lastName}`.trim())}</td>
            <td>${escapeHtml(u.email)}</td>
            <td class="muted">${escapeHtml(u.id)}</td>
          </tr>`
      ).join('');

      win.document.querySelector('.container')!.innerHTML = `
        <table>
          <thead>
            <tr><th>Nom</th><th>Email</th><th class="muted">ID</th></tr>
          </thead>
          <tbody>${tbody || `<tr><td colspan="3" class="muted">Aucun administrateur.</td></tr>`}</tbody>
        </table>
      `;
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="outline" onClick={openAdminsWindow} disabled={loading}>
      {loading ? 'Ouverture…' : 'Voir les admins'}
    </Button>
  );
}

function escapeHtml(s: string) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
