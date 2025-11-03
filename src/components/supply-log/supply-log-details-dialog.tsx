
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import type { SupplyLog, Medicine } from "@/types";
import { Button } from "../ui/button";
import { AddItemToSupplyDialog } from "./add-item-to-supply-dialog";

interface SupplyLogDetailsDialogProps {
  log: SupplyLog;
  shipId: string;
  allMedicines: Medicine[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SupplyLogDetailsDialog({
  log,
  shipId,
  allMedicines,
  open,
  onOpenChange,
}: SupplyLogDetailsDialogProps) {

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Supply Details</DialogTitle>
          <DialogDescription>
            Items included in the supply from {log.supplierName} on{" "}
            {format(log.date, "PPP")}.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto pr-4">
            <div className="flex justify-end mb-4">
                <AddItemToSupplyDialog allMedicines={allMedicines} supplyLogId={log.id} shipId={shipId} />
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Generic Name</TableHead>
                        <TableHead>Trade Name</TableHead>
                        <TableHead>Batch #</TableHead>
                        <TableHead>Expiry</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {log.items && log.items.length > 0 ? (
                        log.items.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.medicineName}</TableCell>
                                <TableCell>{item.manufacturerName || 'N/A'}</TableCell>
                                <TableCell>{item.batchNumber || 'N/A'}</TableCell>
                                <TableCell>{item.expiryDate ? format(new Date(item.expiryDate), 'PPP') : 'N/A'}</TableCell>
                                <TableCell className="text-right">{item.quantity}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                                No items have been added to this supply record yet.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
