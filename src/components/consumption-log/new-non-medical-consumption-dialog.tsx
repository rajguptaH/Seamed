
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
import { NewNonMedicalConsumptionForm } from "./new-non-medical-consumption-form";
import { PlusCircle } from "lucide-react";
import type { InventoryItem } from "@/types";

export function NewNonMedicalConsumptionDialog({ shipId, inventory }: { shipId: string, inventory: InventoryItem[] }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-9 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Log Entry
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Record Non-Medical Consumption</DialogTitle>
          <DialogDescription>
            Record an item that was lost, damaged, or expired. This will update the inventory.
          </DialogDescription>
        </DialogHeader>
        <NewNonMedicalConsumptionForm shipId={shipId} inventory={inventory} onFormSubmit={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
