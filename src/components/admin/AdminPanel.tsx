// components/admin/AdminPanel.tsx
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

import AccountTab   from '@/components/admin/tabs/AccountTab';
import UsersTab     from '@/components/admin/tabs/UsersTab';
import AlumniTab    from '@/components/admin/tabs/AlumniTab';
import AdherentsTab from '@/components/admin/tabs/AdherentsTab';
import BdeTab       from '@/components/admin/tabs/BdeTab';
import EventsTab    from '@/components/admin/tabs/EventsTab';
import GalleryTab   from '@/components/admin/tabs/GalleryTab';
import AnalTab      from '@/components/admin/tabs/AnalTab';
import StagesTab    from '@/components/admin/tabs/StagesTab';
import PartnersTab  from '@/components/admin/tabs/PartnersTab';

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
  { value: 'account', label: 'Mon compte' },
  { value: 'users',   label: 'Utilisateurs' },
  { value: 'alumni',  label: 'Alumnis' },
  { value: 'adherents',  label: 'Adhérent' },
  { value: 'bde',     label: 'BDE' },
  { value: 'partners',     label: 'Partenariats' },
  { value: 'events',  label: 'Evenements' },
  { value: 'gallery', label: 'Gallerie' },
  { value: 'anal',    label: 'Anal' },
  { value: 'stages',    label: 'Stages' },
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
        <TabsContent value="account">
          <AccountTab user={user} />
        </TabsContent>

        <TabsContent value="users">
          <UsersTab />
        </TabsContent>

        <TabsContent value="alumni">
          <AlumniTab />
        </TabsContent>

        <TabsContent value="adherents">
          <AdherentsTab />
        </TabsContent>

        <TabsContent value="bde">
          <BdeTab />
        </TabsContent>

        <TabsContent value="partners">
          <PartnersTab />
        </TabsContent>

        <TabsContent value="events">
          <EventsTab />
        </TabsContent>

        <TabsContent value="gallery">
          <GalleryTab />
        </TabsContent>

        <TabsContent value="anal">
          <AnalTab />
        </TabsContent>

        <TabsContent value="stages">
          <StagesTab />
        </TabsContent>
      </Tabs>
    </main>
  );
}
