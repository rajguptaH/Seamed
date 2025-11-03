
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
import { NewMedicalLogForm } from "./new-medical-log-form";
import { PlusCircle } from "lucide-react";
import type { InventoryItem } from "@/types";

export function NewMedicalLogDialog({ shipId, inventory }: { shipId: string, inventory: InventoryItem[] }) {
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
          <DialogTitle>Add New Medical Log Entry</DialogTitle>
          <DialogDescription>
            Record a new medical incident and automatically update inventory.
          </DialogDescription>
        </DialogHeader>
        <NewMedicalLogForm shipId={shipId} inventory={inventory} onFormSubmit={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
