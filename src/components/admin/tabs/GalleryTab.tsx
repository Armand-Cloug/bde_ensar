'use client';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function GalleryTab() {
  return (
    <Card>
      <CardHeader><CardTitle>Galerie</CardTitle></CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Aperçu des albums / photos (à venir).</p>
      </CardContent>
    </Card>
  );
}
