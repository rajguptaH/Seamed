
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { NewNonMedicalConsumptionDialog } from "./new-non-medical-consumption-dialog";
import type { InventoryItem, NonMedicalConsumptionLog, Ship } from "@/types";

interface NonMedicalConsumptionTableProps { 
    ship: Ship;
    inventory: InventoryItem[];
    logs: NonMedicalConsumptionLog[];
}

export function NonMedicalConsumptionTable({ ship, inventory, logs }: NonMedicalConsumptionTableProps) {
 
  return (
    <Card>
      <CardHeader className="flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1">
            <CardTitle>Non-Medical Consumption Log</CardTitle>
            <CardDescription>
            A record of all items consumed for non-medical reasons (e.g., damage, expiry).
            </CardDescription>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <NewNonMedicalConsumptionDialog shipId={ship.id} inventory={inventory} />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Medicine/Item</TableHead>
              <TableHead>Batch #</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length > 0 ? (
              logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{format(log.date, "PPP")}</TableCell>
                  <TableCell>{log.medicineName}</TableCell>
                  <TableCell>{log.batchNumber}</TableCell>
                  <TableCell>{log.quantity}</TableCell>
                  <TableCell>{log.reason}</TableCell>
                  <TableCell>{log.notes || 'N/A'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No consumption log entries found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
