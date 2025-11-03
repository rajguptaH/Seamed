
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
import { AddNonMandatoryForm } from "./add-non-mandatory-form";
import { PlusCircle } from "lucide-react";
import type { Medicine } from "@/types";

interface AddNonMandatoryDialogProps {
  shipId: string;
  allMedicines: Medicine[];
}

export function AddNonMandatoryDialog({ shipId, allMedicines }: AddNonMandatoryDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Non-Mandatory Item</DialogTitle>
          <DialogDescription>
            Select a medicine or create a new one to add a batch to the ship's inventory.
          </DialogDescription>
        </DialogHeader>
        <AddNonMandatoryForm 
            shipId={shipId} 
            allMedicines={allMedicines} 
            onFormSubmit={() => setOpen(false)} 
        />
      </DialogContent>
    </Dialog>
  );
}
