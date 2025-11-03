
"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateBatchAction } from "@/lib/actions";
import type { Batch } from "@/types";
import { DatePicker } from "../ui/date-picker";

const UpdateBatchSchema = z.object({
  batchId: z.string(),
  quantity: z.coerce.number().int().min(0, "Quantity cannot be negative."),
  batchNumber: z.string().optional().nullable(),
  expiryDate: z.date().optional().nullable(),
  manufacturerName: z.string().optional().nullable(),
});

export function EditBatchForm({ batch, onFormSubmit }: { batch: Batch; onFormSubmit: () => void }) {
  const [state, dispatch] = useActionState(updateBatchAction, {
    message: "",
    errors: {},
  });
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [date, setDate] = useState<Date | undefined>(batch.expiryDate ? new Date(batch.expiryDate) : undefined);

  const form = useForm<z.infer<typeof UpdateBatchSchema>>({
    resolver: zodResolver(UpdateBatchSchema),
    defaultValues: {
      batchId: batch.id,
      quantity: batch.quantity,
      batchNumber: batch.batchNumber,
      expiryDate: batch.expiryDate ? new Date(batch.expiryDate) : undefined,
      manufacturerName: batch.manufacturerName,
    },
  });

  useEffect(() => {
    if (state.message && !state.errors) {
      toast({
        title: "Success",
        description: state.message,
      });
      onFormSubmit();
    } else if (state.message && state.errors) {
       toast({
        title: "Error",
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state, onFormSubmit, toast]);

  return (
    <Form {...form}>
      <form
        ref={formRef}
        action={dispatch}
        className="grid gap-4 py-4"
      >
        <input type="hidden" name="batchId" value={batch.id} />
        
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 100" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="manufacturerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Manufacturer's Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Panadol (optional)" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="batchNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Batch Number</FormLabel>
              <FormControl>
                <Input placeholder="e.g., BATCH12345" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="expiryDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Expiry Date</FormLabel>
              <input type="hidden" name="expiryDate" value={date?.toISOString()} />
              <DatePicker date={date} setDate={setDate} />
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full">
          Save Changes
        </Button>
      </form>
    </Form>
  );
}
