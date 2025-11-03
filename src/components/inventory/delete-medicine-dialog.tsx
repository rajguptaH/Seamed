"use client";

import { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Medicine } from "@/types";
import { Trash2 } from "lucide-react";
import { deleteMedicineAction } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

export function DeleteMedicineDialog({ item }: { item: Medicine }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(deleteMedicineAction, { message: "", errors: {}});
  const { toast } = useToast();

  useEffect(() => {
    if (state.message) {
      if(state.errors) {
        toast({ title: "Error", description: state.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: state.message });
        setOpen(false);
      }
    }
  }, [state, toast]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button aria-label="Delete" variant="ghost" size="icon" className="text-destructive hover:text-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this item?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete "{item.name}" from the master list and all ship inventories. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <form action={formAction}>
            <input type="hidden" name="id" value={item.id} />
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction type="submit" disabled={isPending}>
              {isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
