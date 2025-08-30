// src/components/admin/tabs/anal/Section.tsx
'use client';

import * as React from 'react';

type Props = {
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export default function Section({ title, children, className }: Props) {
  return (
    <div className={['rounded-lg border bg-white shadow-sm', className].filter(Boolean).join(' ')}>
      <div className="px-3 py-2 text-sm font-medium bg-amber-50/60 border-b">
        {title}
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}
