'use client'

import Image from 'next/image'
import type { ColumnDef } from '@tanstack/react-table'
import DeleteScoreButton from './DeleteScoreButton'

export type RankingRow = {
  id: string
  userId: string
  rank: number
  score: number
  createdAt: string | null
  user: { name: string; image?: string | null; email?: string | null }
}

function Avatar({ image, name }: { image?: string | null; name: string }) {
  if (image) {
    return (
      <div className="relative h-8 w-8 overflow-hidden rounded-full bg-muted">
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
    )
  }
  const initials = name.split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase()
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-bold">
      {initials}
    </div>
  )
}

/** Fabrique les colonnes pour un jeu donné */
export const columns = (game: string, onReload: () => void): ColumnDef<RankingRow>[] => [
  {
    id: 'rank',
    header: '#',
    size: 40,
    cell: ({ row }) => row.original.rank,
  },
  {
    id: 'player',
    header: 'Joueur',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar image={row.original.user.image} name={row.original.user.name} />
        <div className="leading-tight">
          <div className="font-medium">{row.original.user.name}</div>
          <div className="text-xs text-muted-foreground">{row.original.user.email ?? '—'}</div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'score',
    header: 'Score',
    cell: ({ row }) => <span className="font-semibold">{row.original.score}</span>,
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <DeleteScoreButton game={game} scoreId={row.original.id} onDone={onReload} />
    ),
  },
]
