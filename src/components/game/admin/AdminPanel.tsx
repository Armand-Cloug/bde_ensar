// src/components/admin/AdminPanel.tsx
'use client';

import { useState } from 'react';

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

import RankingTab from '@/components/game/admin/tabs/RankingTab';
import QuizzTab   from '@/components/game/admin/tabs/QuizzTab';

export type AdminUser = {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  image: string | null;
  promotion: string | null;
  birthdate: string | Date | null;
  company: string | null;
  role: string | null;
};

type Props = { user: AdminUser };

const TABS = [
  { value: 'ranking',   label: 'Ranking' },
  { value: 'quizz',     label: 'Quizz' },
];

export default function AdminPanel({ user }: Props) {
  const [tab, setTab] = useState<string>('account');

  return (
    <main className="px-4 py-6 max-w-6xl mx-auto">
      {/* Sélecteur responsive : Select (mobile) / Tabs (desktop) */}
      <div className="mb-4">
        {/* Mobile */}
        <div className="md:hidden">
          <Select value={tab} onValueChange={setTab}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir un menu" />
            </SelectTrigger>
            <SelectContent>
              {TABS.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Desktop */}
        <Tabs value={tab} onValueChange={setTab} className="hidden md:block">
          <TabsList className="flex flex-wrap">
            {TABS.map((t) => (
              <TabsTrigger
                key={t.value}
                value={t.value}
                className="whitespace-nowrap"
              >
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Contenus */}
      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <TabsContent value="ranking">
          <RankingTab user={user} />
        </TabsContent>
        <TabsContent value="quizz">
          <QuizzTab user={user} />
        </TabsContent>
      </Tabs>
    </main>
  );
}
