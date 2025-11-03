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
import { NewShipForm } from "./new-ship-form";
import { PlusCircle } from "lucide-react";
import type { Company } from "@/types";

export function NewShipDialog({ companies }: { companies: Company[] }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add New Ship
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Ship</DialogTitle>
          <DialogDescription>
            Enter the details of the new vessel to add it to your fleet.
          </DialogDescription>
        </DialogHeader>
        <NewShipForm companies={companies} onFormSubmit={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
