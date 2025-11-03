
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
import { DatePicker } from "../ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import type { Medicine } from "@/types";
import { addItemsToSupplyLogAction } from "@/lib/actions";

const AddItemToSupplyLogSchema = z.object({
  shipId: z.string(),
  supplyLogId: z.string(),
  medicineId: z.string().min(1, "An item must be selected."),
  manufacturerName: z.string().optional().nullable(),
  batchNumber: z.string().optional().nullable(),
  expiryDate: z.date().optional().nullable(),
  quantity: z.coerce.number().int().positive("Quantity must be a positive number."),
});

type FormValues = z.infer<typeof AddItemToSupplyLogSchema>;

interface AddItemToSupplyFormProps {
  allMedicines: Medicine[];
  supplyLogId: string;
  shipId: string;
  onFormSubmit: () => void;
}

export function AddItemToSupplyForm({ allMedicines, supplyLogId, shipId, onFormSubmit }: AddItemToSupplyFormProps) {
  const [state, dispatch] = useActionState(addItemsToSupplyLogAction, {
    message: "",
    errors: {},
  });
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [date, setDate] = useState<Date | undefined>();

  const form = useForm<FormValues>({
    resolver: zodResolver(AddItemToSupplyLogSchema),
    defaultValues: {
      shipId,
      supplyLogId,
      quantity: 1,
    },
  });

  useEffect(() => {
    if (state.message && !state.errors) {
      toast({
        title: "Success",
        description: state.message,
      });
      onFormSubmit();
      form.reset({ shipId, supplyLogId, quantity: 1 });
      setDate(undefined);
    } else if (state.message && state.errors) {
       toast({
        title: "Error",
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state, onFormSubmit, toast, form, shipId, supplyLogId]);

  const itemOptions = allMedicines.sort((a,b) => a.name.localeCompare(b.name));

  return (
    <Form {...form}>
      <form
        ref={formRef}
        action={dispatch}
        className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2"
      >
        <input type="hidden" name="shipId" value={shipId} />
        <input type="hidden" name="supplyLogId" value={supplyLogId} />
        <input type="hidden" name="expiryDate" value={date?.toISOString()} />

        <FormField
            control={form.control}
            name="medicineId"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Generic Name / Equipment</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                    <SelectTrigger>
                    <SelectValue placeholder="Select an item" />
                    </SelectTrigger>
                </FormControl>
                <SelectContent>
                    {itemOptions.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                        {item.name} ({item.type})
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>
                <FormMessage />
            </FormItem>
            )}
        />
        
        <FormField
          control={form.control}
          name="manufacturerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trade Name (from Manufacturer)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Panadol (optional)" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
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
                name="batchNumber"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Batch Number</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., BATCH123" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
        
        <FormField
          control={form.control}
          name="expiryDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Expiry Date</FormLabel>
              <DatePicker date={date} setDate={setDate} />
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full">
          Add Item
        </Button>
      </form>
    </Form>
  );
}
