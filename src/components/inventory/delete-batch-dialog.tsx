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
import { Trash2 } from "lucide-react";
import { deleteBatchAction } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

export function DeleteBatchDialog({ batchId, shipId }: { batchId: string, shipId: string }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(deleteBatchAction, { message: "", errors: {}});
  const { toast } = useToast();

  useEffect(() => {
    if (state.message) {
      if(state.errors && Object.keys(state.errors).length > 0) {
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
          <AlertDialogTitle>Are you sure you want to delete this batch?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this batch record. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <form action={formAction}>
            <input type="hidden" name="batchId" value={batchId} />
            <input type="hidden" name="shipId" value={shipId} />
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
