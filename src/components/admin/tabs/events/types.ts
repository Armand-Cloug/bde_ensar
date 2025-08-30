// src/components/admin/tabs/events/types.ts

export type EventRow = {
  id: string;
  title: string;
  date: string; // ISO
  location: string | null;
  isActive: boolean;
};
