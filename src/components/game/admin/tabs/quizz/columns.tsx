'use client'

import type { ColumnDef } from '@tanstack/react-table'
import DeleteQuestionButton from './DeleteQuestionButton'

export type QuizzRow = {
  id: string
  question: string
  answer: string
  points: number
  difficulty: string
  category: string
  status: boolean
  createdAt: string | null
}

// fabrique les colonnes pour la liste active
export const columns = ({ onDeleted }: { onDeleted?: () => void } = {}): ColumnDef<QuizzRow>[] => [
  { id: 'category',   header: 'Catégorie',   cell: ({ row }) => row.original.category },
  { id: 'question',   header: 'Question',    cell: ({ row }) => <span className="line-clamp-2">{row.original.question}</span> },
  { id: 'difficulty', header: 'Difficulté',  cell: ({ row }) => row.original.difficulty },
  { id: 'points',     header: 'Points',      cell: ({ row }) => <span className="font-semibold">{row.original.points}</span> },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <div className="flex justify-end">
        <DeleteQuestionButton id={row.original.id} onDone={onDeleted} />
      </div>
    ),
  },
]
