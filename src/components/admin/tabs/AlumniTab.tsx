'use client';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function AlumniTab() {
  return (
    <Card>
      <CardHeader><CardTitle>Alumnis</CardTitle></CardHeader>
      <CardContent>
        <ScrollArea className="w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Prénom</TableHead>
                <TableHead>Diplôme</TableHead>
                <TableHead>Année</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Smith</TableCell>
                <TableCell>Anna</TableCell>
                <TableCell>MS</TableCell>
                <TableCell>2024</TableCell>
                <TableCell>en_attente</TableCell>
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
