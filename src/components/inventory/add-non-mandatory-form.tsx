
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
import { addNonMandatoryItemAction } from "@/lib/actions";
import { DatePicker } from "../ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import type { Medicine } from "@/types";
import { Checkbox } from "../ui/checkbox";
import { Textarea } from "../ui/textarea";

const AddNonMandatorySchema = z.object({
  shipId: z.string(),
  isNewMedicine: z.boolean().default(false),
  medicineId: z.string().optional(),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1."),
  batchNumber: z.string().optional().nullable(),
  expiryDate: z.date().optional().nullable(),
  // New medicine fields
  name: z.string().optional(),
  form: z.string().optional(),
  strength: z.string().optional(),
  indication: z.string().optional(),
  notes: z.string().optional(),
}).refine(data => {
    if (data.isNewMedicine) {
        return data.name && data.name.length >= 3 && data.form && data.form.length >= 2 && data.indication && data.indication.length >= 3;
    }
    return !!data.medicineId;
}, {
    message: "Either select an existing medicine or provide all required details for a new one.",
    path: ["medicineId"],
});


interface AddNonMandatoryFormProps {
    shipId: string;
    allMedicines: Medicine[];
    onFormSubmit: () => void;
}

export function AddNonMandatoryForm({ shipId, allMedicines, onFormSubmit }: AddNonMandatoryFormProps) {
  const [state, dispatch] = useActionState(addNonMandatoryItemAction, {
    message: "",
    errors: {},
  });
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [date, setDate] = useState<Date | undefined>();

  const form = useForm<z.infer<typeof AddNonMandatorySchema>>({
    resolver: zodResolver(AddNonMandatorySchema),
    defaultValues: {
      shipId,
      isNewMedicine: false,
      medicineId: "",
      quantity: 1,
      batchNumber: "",
      expiryDate: undefined,
      name: "",
      form: "",
      strength: "",
      indication: "",
      notes: "",
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
      setDate(undefined);
    } else if (state.message && state.errors) {
       toast({
        title: "Error",
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state, onFormSubmit, toast, form]);
  
  const medicineOptions = allMedicines.filter(m => m.type === 'Medicine').sort((a, b) => a.name.localeCompare(b.name));
  const isNewMedicine = form.watch("isNewMedicine");

  return (
    <Form {...form}>
      <form
        ref={formRef}
        action={dispatch}
        className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2"
      >
        <input type="hidden" name="shipId" value={shipId} />
        
        <FormField
          control={form.control}
          name="isNewMedicine"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  name="isNewMedicine"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Create new medicine
                </FormLabel>
              </div>
            </FormItem>
          )}
        />
        
        {isNewMedicine ? (
            <>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Medicine Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., New Painkiller" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="form"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Form</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., tab, amp" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="strength"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Strength</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 500mg (optional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="indication"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Indication</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Pain, Fever" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </>
        ) : (
            <FormField
              control={form.control}
              name="medicineId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medicine</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a medicine" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {medicineOptions.map(item => (
                            <SelectItem key={item.id} value={item.id}>
                                {item.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
        )}
        
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 10" {...field} />
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
                <Input placeholder="e.g., BATCH123 (optional)" {...field} value={field.value ?? ""} />
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
          Add Item
        </Button>
      </form>
    </Form>
  );
}
