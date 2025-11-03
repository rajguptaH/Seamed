
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
import { createMedicineAction } from "@/lib/actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";

const MedicineSchema = z.object({
  name: z.string().min(3, "Item name must be at least 3 characters long."),
  type: z.enum(['Medicine', 'Equipment']),
  category: z.string().optional().nullable(),
  form: z.string().min(2, "Form must be at least 2 characters long."),
  strength: z.string().optional(),
  indication: z.string().min(3, "Indication must be at least 3 characters long."),
  notes: z.string().optional(),
  categoryA: z.string().optional(),
  categoryB: z.string().optional(),
  categoryC: z.string().optional(),
  quantity: z.string().optional(),
});


export function NewMedicineForm({ onFormSubmit }: { onFormSubmit: () => void }) {
  const [state, dispatch] = useActionState(createMedicineAction, {
    message: "",
    errors: {},
  });
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<z.infer<typeof MedicineSchema>>({
    resolver: zodResolver(MedicineSchema),
    defaultValues: {
      name: "",
      type: 'Medicine',
      category: "",
      form: "",
      strength: "",
      indication: "",
      notes: "",
      categoryA: "0",
      categoryB: "0",
      categoryC: "0",
      quantity: "0",
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

  const { pending } = useFormStatus();
  const itemType = form.watch("type");

  return (
    <Form {...form}>
      <form ref={formRef} action={dispatch} className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
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
        {itemType === 'Medicine' && (
           <>
            <div className="grid grid-cols-3 gap-4">
                <FormField
                    control={form.control}
                    name="categoryA"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Qty (Cat A)</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., 50" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="categoryB"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Qty (Cat B)</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., 50" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="categoryC"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Qty (Cat C)</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., 0" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
           </>
        )}
        {itemType === "Equipment" && (
          <>
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
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>Required Quantity</FormLabel>
                  <FormControl>
                      <Input placeholder="e.g., 1" {...field} />
                  </FormControl>
                  <FormMessage />
                  </FormItem>
              )}
            />
          </>
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
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g., double if crew size > 30 (optional)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Adding Item..." : "Add Item"}
        </Button>
      </form>
    </Form>
  );
}
