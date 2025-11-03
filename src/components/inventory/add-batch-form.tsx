
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
import { addBatchAction } from "@/lib/actions";
import { DatePicker } from "../ui/date-picker";

const AddBatchSchema = z.object({
  inventoryItemId: z.string(),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1."),
  batchNumber: z.string().optional().nullable(),
  expiryDate: z.date().optional().nullable(),
  shipId: z.string(),
  manufacturerName: z.string().optional().nullable(),
});

export function AddBatchForm({ inventoryItemId, shipId, onFormSubmit }: { inventoryItemId: string; shipId: string; onFormSubmit: () => void }) {
  const [state, dispatch] = useActionState(addBatchAction, {
    message: "",
    errors: {},
  });
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [date, setDate] = useState<Date | undefined>();

  const form = useForm<z.infer<typeof AddBatchSchema>>({
    resolver: zodResolver(AddBatchSchema),
    defaultValues: {
      inventoryItemId,
      shipId,
      quantity: 1,
      batchNumber: "",
      expiryDate: undefined,
      manufacturerName: "",
    },
  });

  useEffect(() => {
    if (state.message && !state.errors) {
      toast({
        title: "Success",
        description: state.message,
      });
      onFormSubmit();
      form.reset();
    } else if (state.message && state.errors) {
       toast({
        title: "Error",
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state, onFormSubmit, toast, form]);

  return (
    <Form {...form}>
      <form
        ref={formRef}
        action={dispatch}
        className="grid gap-4 py-4"
      >
        <input type="hidden" name="inventoryItemId" value={inventoryItemId} />
        <input type="hidden" name="shipId" value={shipId} />
        
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
          Add Batch
        </Button>
      </form>
    </Form>
  );
}
