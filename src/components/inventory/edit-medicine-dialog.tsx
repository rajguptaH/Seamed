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
import { EditMedicineForm } from "./edit-medicine-form";
import type { Medicine } from "@/types";
import { Pencil } from "lucide-react";

export function EditMedicineDialog({ item }: { item: Medicine }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button aria-label="Edit" variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit: {item.name}</DialogTitle>
          <DialogDescription>
            Update the details for this item in the master list.
          </DialogDescription>
        </DialogHeader>
        <EditMedicineForm item={item} onFormSubmit={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
