
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
import { AddBatchForm } from "./add-batch-form";
import { PlusCircle } from "lucide-react";

export function AddBatchDialog({ inventoryItemId, shipId }: { inventoryItemId: string; shipId: string; }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Batch
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Batch</DialogTitle>
          <DialogDescription>
            Enter the details for the new batch.
          </DialogDescription>
        </DialogHeader>
        <AddBatchForm inventoryItemId={inventoryItemId} shipId={shipId} onFormSubmit={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
