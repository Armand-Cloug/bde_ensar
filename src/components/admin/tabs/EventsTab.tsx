'use client';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function EventsTab() {
  return (
    <Card>
      <CardHeader><CardTitle>Événements</CardTitle></CardHeader>
      <CardContent>
        <ScrollArea className="w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Lieu</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Soirée Intégration</TableCell>
                <TableCell>01/10/2025</TableCell>
                <TableCell>Campus ENSAR</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">Voir</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
