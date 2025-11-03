"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
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
import { updateMedicineAction } from "@/lib/actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import type { Medicine } from "@/types";

const MedicineSchema = z.object({
  id: z.string(),
  name: z.string().min(3, "Item name must be at least 3 characters long."),
  type: z.enum(['Medicine', 'Equipment']),
  category: z.string().optional().nullable(),
  form: z.string().min(2, "Form must be at least 2 characters long."),
  strength: z.string().optional(),
  indication: z.string().min(3, "Indication must be at least 3 characters long."),
  notes: z.string().optional(),
});

export function EditMedicineForm({ item, onFormSubmit }: { item: Medicine, onFormSubmit: () => void }) {
  const [state, dispatch] = useActionState(updateMedicineAction, {
    message: "",
    errors: {},
  });
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<z.infer<typeof MedicineSchema>>({
    resolver: zodResolver(MedicineSchema),
    defaultValues: {
      id: item.id,
      name: item.name,
      type: item.type,
      category: item.category,
      form: item.form,
      strength: item.strength ?? "",
      indication: item.indication,
      notes: item.notes ?? "",
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

  const { pending } = useFormStatus();
  const itemType = form.watch("type");

  return (
    <Form {...form}>
      <form ref={formRef} action={dispatch} className="grid gap-4 py-4">
        <input type="hidden" name="id" value={item.id} />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Acetylsalicylic acid" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                 <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                    <SelectItem value="Medicine">Medicine</SelectItem>
                    <SelectItem value="Equipment">Equipment</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
         {itemType === "Equipment" && (
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Resuscitation" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
         <FormField
          control={form.control}
          name="form"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Form</FormLabel>
              <FormControl>
                <Input placeholder="e.g., tab, amp, kit" {...field} />
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
                <Input placeholder="e.g., 500mg (optional)" {...field} value={field.value ?? ""} />
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
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g., double if crew size > 30 (optional)" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}
