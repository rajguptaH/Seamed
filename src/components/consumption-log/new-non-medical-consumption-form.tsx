
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
import { createNonMedicalConsumptionLogAction } from "@/lib/actions";
import { DatePicker } from "../ui/date-picker";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import type { InventoryItem, Batch } from "@/types";
import { NonMedicalConsumptionReasons } from "@/types";


const NonMedicalConsumptionLogSchema = z.object({
  shipId: z.string(),
  date: z.date(),
  medicineId: z.string().min(1, "Medicine must be selected."),
  batchId: z.string().min(1, "Batch must be selected."),
  quantity: z.coerce.number().int().positive("Quantity must be greater than 0."),
  reason: z.enum(NonMedicalConsumptionReasons),
  notes: z.string().optional().nullable(),
});

type FormValues = z.infer<typeof NonMedicalConsumptionLogSchema>;

interface NewNonMedicalConsumptionFormProps {
  shipId: string;
  inventory: InventoryItem[];
  onFormSubmit: () => void;
}

export function NewNonMedicalConsumptionForm({ shipId, inventory, onFormSubmit }: NewNonMedicalConsumptionFormProps) {
  const [state, dispatch] = useActionState(createNonMedicalConsumptionLogAction, {
    message: "",
    errors: {},
  });
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedMedicineBatches, setSelectedMedicineBatches] = useState<Batch[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(NonMedicalConsumptionLogSchema),
    defaultValues: {
      shipId,
      date: new Date(),
      notes: "",
    },
  });

  const medicineId = form.watch("medicineId");

  useEffect(() => {
    if (medicineId) {
      const selectedItem = inventory.find(item => item.id === medicineId);
      setSelectedMedicineBatches(selectedItem?.batches || []);
      form.setValue("batchId", undefined); // Reset batch when medicine changes
    } else {
      setSelectedMedicineBatches([]);
    }
  }, [medicineId, inventory, form]);


  useEffect(() => {
    if (state.message && !state.errors) {
      toast({
        title: "Success",
        description: state.message,
      });
      onFormSubmit();
      form.reset();
      setDate(new Date());
    } else if (state.message && state.errors) {
       toast({
        title: "Error",
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state, onFormSubmit, toast, form]);
  
  const availableInventory = inventory.filter(item => item.totalQuantity > 0);

  return (
    <Form {...form}>
      <form
        ref={formRef}
        action={dispatch}
        className="grid gap-4 py-4"
      >
        <input type="hidden" name="shipId" value={shipId} />
        
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of Consumption</FormLabel>
              <input type="hidden" name="date" value={date?.toISOString()} />
              <DatePicker date={date} setDate={setDate} />
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="medicineId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Medicine/Item Consumed</FormLabel>
               <Select onValueChange={field.onChange} defaultValue={field.value ?? ""}>
                 <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an item from inventory" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                    {availableInventory.map(item => (
                        <SelectItem key={item.id} value={item.id}>
                            {item.medicineName} ({item.totalQuantity} available)
                        </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {medicineId && (
            <div className="grid grid-cols-2 gap-4">
                 <FormField
                    control={form.control}
                    name="batchId"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Batch</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value ?? ""}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a batch" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {selectedMedicineBatches.map(batch => (
                                    <SelectItem key={batch.id} value={batch.id}>
                                        {batch.batchNumber || 'N/A'} (Qty: {batch.quantity})
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
                    name="quantity"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Quantity Consumed</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="e.g., 1" {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        )}

         <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason for Consumption</FormLabel>
               <Select onValueChange={field.onChange} defaultValue={field.value ?? ""}>
                 <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                    {NonMedicalConsumptionReasons.map(reason => (
                        <SelectItem key={reason} value={reason}>
                            {reason}
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
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Any other relevant details (optional)..." {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Record Consumption
        </Button>
      </form>
    </Form>
  );
}
