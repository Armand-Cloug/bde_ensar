'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export default function DeleteScoreButton({
  game,
  scoreId,
  onDone,
}: {
  game: string
  scoreId: string
  onDone?: () => void
}) {
  const { toast } = useToast()
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  async function run() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/game/scores/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game, scoreId }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j?.message || 'Suppression impossible')
      }
      toast({ title: 'Score supprimé' })
      onDone?.()
    } catch (e: any) {
      toast({ title: 'Erreur', description: e?.message ?? 'Échec', variant: 'destructive' })
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={(v) => !loading && setOpen(v)}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">Supprimer</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer ce score ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est définitive et retire le score du classement.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={run} disabled={loading}>Confirmer</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
