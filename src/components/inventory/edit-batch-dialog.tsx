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
import { EditBatchForm } from "./edit-batch-form";
import type { Batch } from "@/types";
import { Pencil } from "lucide-react";

export function EditBatchDialog({ batch }: { batch: Batch }) {
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
          <DialogTitle>Edit Batch</DialogTitle>
          <DialogDescription>
            Update the quantity, batch number, and expiry date for this batch.
          </DialogDescription>
        </DialogHeader>
        <EditBatchForm batch={batch} onFormSubmit={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
