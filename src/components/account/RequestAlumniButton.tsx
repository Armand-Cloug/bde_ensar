'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function RequestAlumniButton({ isAlumni }: { isAlumni: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  async function submit() {
    setBusy(true);
    try {
      const res = await fetch('/api/alumni/request', { method: 'POST' });
      if (res.ok) {
        setSent(true);
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  if (isAlumni) {
    return <Button variant="secondary" disabled>Alumni</Button>;
  }

  if (sent) {
    return <Button variant="secondary" disabled>Demande envoyée</Button>;
  }

  return (
    <Button variant="outline" onClick={submit} disabled={busy}>
      Devenir Alumni
    </Button>
  );
}
