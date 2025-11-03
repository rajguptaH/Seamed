
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
import { NewSupplyLogForm } from "./new-supply-log-form";
import { PlusCircle } from "lucide-react";

export function NewSupplyLogDialog({ shipId }: { shipId: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-9 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Supply Record
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Supply Record</DialogTitle>
          <DialogDescription>
            Record a new medicine supply shipment for this vessel.
          </DialogDescription>
        </DialogHeader>
        <NewSupplyLogForm shipId={shipId} onFormSubmit={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
