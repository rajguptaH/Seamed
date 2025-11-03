
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddItemToSupplyForm } from "./add-item-to-supply-form";
import { PlusCircle } from "lucide-react";
import type { Medicine } from "@/types";

interface AddItemToSupplyDialogProps {
  allMedicines: Medicine[];
  supplyLogId: string;
  shipId: string;
}

export function AddItemToSupplyDialog({ allMedicines, supplyLogId, shipId }: AddItemToSupplyDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-9 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Item to Supply
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Item to Supply Log</DialogTitle>
          <DialogDescription>
            Select a medicine and enter its details. This will also add a new batch to the ship's inventory.
          </DialogDescription>
        </DialogHeader>
        <AddItemToSupplyForm allMedicines={allMedicines} supplyLogId={supplyLogId} shipId={shipId} onFormSubmit={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
