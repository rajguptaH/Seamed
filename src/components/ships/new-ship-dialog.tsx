"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useData } from "@/context/DataProvider";
import { API_ENTITIES } from "@/utils/routes";
import { PlusCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { NewShipForm } from "./new-ship-form";


export function NewShipDialog() {
  const [open, setOpen] = useState(false);
  const { data } = useData();
  const company = useMemo(() => data[API_ENTITIES.companies] || [], [data]);
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
        <NewShipForm companies={company} onFormSubmit={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
