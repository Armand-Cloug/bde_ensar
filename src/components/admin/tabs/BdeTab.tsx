'use client';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function BdeTab() {
  return (
    <Card>
      <CardHeader><CardTitle>BDE</CardTitle></CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Liste des BDE et membres — sélectionnez une ligne pour voir les détails (à venir).
        </p>
      </CardContent>
    </Card>
  );
}
