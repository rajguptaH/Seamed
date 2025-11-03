
"use client";

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { InventoryItem, Batch, Medicine } from "@/types";
import { format } from "date-fns";
import { EditBatchDialog } from "./edit-batch-dialog";
import { DeleteBatchDialog } from "./delete-batch-dialog";
import { AddNonMandatoryDialog } from "./add-non-mandatory-dialog";

function ExpiryDisplay({ expiryDate }: { expiryDate: Date | null }) {
  if (!expiryDate) {
    return <Badge variant="secondary">N/A</Badge>;
  }
  return <span>{format(new Date(expiryDate), "PPP")}</span>;
}

export function NonMandatoryInventoryTable({ inventory, shipId, allMedicines }: { inventory: InventoryItem[], shipId: string, allMedicines: Medicine[] }) {
  
  const allBatches = inventory.flatMap(item => 
    item.batches.map(batch => ({
      ...batch,
      medicineName: item.medicineName,
      medicineId: item.medicineId,
      inventoryItemId: item.id
    }))
  ).sort((a,b) => a.medicineName.localeCompare(b.medicineName));

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle>Non-Mandatory Inventory</CardTitle>
                <CardDescription>
                Medicines on board that are not part of the flag state requirements.
                </CardDescription>
            </div>
            <AddNonMandatoryDialog shipId={shipId} allMedicines={allMedicines} />
        </div>
      </CardHeader>
      <CardContent>
         {allBatches.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medicine Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Batch Number</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allBatches.map((batch) => (
                <TableRow key={batch.id}>
                  <TableCell className="font-medium">{batch.medicineName}</TableCell>
                  <TableCell>{batch.quantity}</TableCell>
                  <TableCell>{batch.batchNumber || "N/A"}</TableCell>
                  <TableCell>
                    <ExpiryDisplay expiryDate={batch.expiryDate} />
                  </TableCell>
                  <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        <EditBatchDialog batch={batch} />
                        <DeleteBatchDialog batchId={batch.id} shipId={shipId} />
                      </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
            <div className="text-center text-sm text-muted-foreground p-8">
              No non-mandatory medicine batches found.
            </div>
        )}
      </CardContent>
    </Card>
  );
}
