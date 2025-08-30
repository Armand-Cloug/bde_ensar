// src/components/admin/tabs/AlumniTab.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { makeAlumniColumns, type AlumniRow } from "./alumni/alumni-columns";
import { makeRequestColumns, type RequestRow } from "./alumni/request-columns";
import { DataTableServer } from "./users/data-table-server";

import * as React from "react";

function useDebounced<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export default function AlumniTab() {
  // --- LISTE ALUMNIS VALIDÉS
  const [aData, setAData] = React.useState<AlumniRow[]>([]);
  const [aLoading, setALoading] = React.useState(true);
  const [aQ, setAQ] = React.useState("");
  const [aPage, setAPage] = React.useState(1);
  const aPageSize = 15;
  const [aTotal, setATotal] = React.useState(0);
  const aQDebounced = useDebounced(aQ, 350);

  // --- LISTE DEMANDES
  const [rData, setRData] = React.useState<RequestRow[]>([]);
  const [rLoading, setRLoading] = React.useState(true);
  const [rQ, setRQ] = React.useState("");
  const [rPage, setRPage] = React.useState(1);
  const rPageSize = 15;
  const [rTotal, setRTotal] = React.useState(0);
  const rQDebounced = useDebounced(rQ, 350);

  React.useEffect(() => setAPage(1), [aQ]);
  React.useEffect(() => setRPage(1), [rQ]);

  // Fetch alumni
  const loadAlumni = React.useCallback(async () => {
    setALoading(true);
    try {
      const url = `/api/admin/alumni?q=${encodeURIComponent(aQDebounced)}&page=${aPage}&pageSize=${aPageSize}`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error("fetch alumni failed");
      const json = await res.json();
      setAData(json.alumni ?? []);
      setATotal(json.total ?? 0);
    } finally {
      setALoading(false);
    }
  }, [aQDebounced, aPage]);

  // Fetch requests
  const loadRequests = React.useCallback(async () => {
    setRLoading(true);
    try {
      const url = `/api/admin/alumni/requests?q=${encodeURIComponent(rQDebounced)}&page=${rPage}&pageSize=${rPageSize}`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error("fetch requests failed");
      const json = await res.json();
      setRData(json.requests ?? []);
      setRTotal(json.total ?? 0);
    } finally {
      setRLoading(false);
    }
  }, [rQDebounced, rPage]);

  React.useEffect(() => { loadAlumni(); }, [loadAlumni]);
  React.useEffect(() => { loadRequests(); }, [loadRequests]);

  // Actions
  async function approveRequest(id: string) {
    await fetch(`/api/admin/alumni/requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "approve" }),
    });
    // rafraîchir 2 listes
    await Promise.all([loadRequests(), loadAlumni()]);
  }

  async function rejectRequest(id: string) {
    await fetch(`/api/admin/alumni/requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reject" }),
    });
    await loadRequests();
  }

  async function removeAlumni(userId: string) {
    await fetch(`/api/admin/alumni/${userId}`, { method: "DELETE" });
    await loadAlumni();
  }

  return (
    <div className="space-y-8">
      {/* Alumnis */}
      <Card>
        <CardHeader><CardTitle>Alumnis</CardTitle></CardHeader>
        <CardContent>
          <DataTableServer
            columns={makeAlumniColumns(removeAlumni)}
            data={aData}
            searchValue={aQ}
            onSearchChange={setAQ}
            isLoading={aLoading}
            page={aPage}
            pageSize={aPageSize}
            total={aTotal}
            onPrev={() => setAPage(p => Math.max(1, p - 1))}
            onNext={() => setAPage(p => (p * aPageSize >= aTotal ? p : p + 1))}
          />
        </CardContent>
      </Card>

      {/* Demandes d'alumni */}
      <Card>
        <CardHeader><CardTitle>Demandes d’alumni</CardTitle></CardHeader>
        <CardContent>
          <DataTableServer
            columns={makeRequestColumns(approveRequest, rejectRequest)}
            data={rData}
            searchValue={rQ}
            onSearchChange={setRQ}
            isLoading={rLoading}
            page={rPage}
            pageSize={rPageSize}
            total={rTotal}
            onPrev={() => setRPage(p => Math.max(1, p - 1))}
            onNext={() => setRPage(p => (p * rPageSize >= rTotal ? p : p + 1))}
          />
        </CardContent>
      </Card>
    </div>
  );
}
