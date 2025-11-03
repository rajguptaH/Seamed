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
import { NewMedicineForm } from "./new-medicine-form";
import { PlusCircle } from "lucide-react";

export function NewMedicineDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-9 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Medicine
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Medicine/Equipment</DialogTitle>
          <DialogDescription>
            Enter the details of the new item to add it to the database.
          </DialogDescription>
        </DialogHeader>
        <NewMedicineForm onFormSubmit={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
