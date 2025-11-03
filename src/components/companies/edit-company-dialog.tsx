
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
import { EditCompanyForm } from "./edit-company-form";
import type { Company } from "@/types";
import { Pencil } from "lucide-react";

export function EditCompanyDialog({ company }: { company: Company }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="h-8 gap-1">
          <Pencil className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Edit Company
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit: {company.name}</DialogTitle>
          <DialogDescription>
            Update the details for this company.
          </DialogDescription>
        </DialogHeader>
        <EditCompanyForm company={company} onFormSubmit={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
