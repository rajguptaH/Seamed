

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
import { createMedicalLogAction } from "@/lib/actions";
import { DatePicker } from "../ui/date-picker";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import type { InventoryItem, Batch } from "@/types";
import Image from "next/image";

const MedicalLogSchema = z.object({
  shipId: z.string(),
  date: z.date(),
  crewMemberName: z.string().min(1, "Crew member name is required."),
  rank: z.string().min(1, "Rank is required."),
  caseDescription: z.string().min(1, "Case description is required."),
  medicineUsedId: z.string().min(1, "Medicine must be selected."),
  batchUsedId: z.string().min(1, "Batch must be selected."),
  quantityUsed: z.coerce.number().int().positive("Quantity must be greater than 0."),
  notes: z.string().optional().nullable(),
  photoUrl: z.string().optional().nullable(),
});

type MedicalLogFormValues = z.infer<typeof MedicalLogSchema>;

interface NewMedicalLogFormProps {
  shipId: string;
  inventory: InventoryItem[];
  onFormSubmit: () => void;
}

export function NewMedicalLogForm({ shipId, inventory, onFormSubmit }: NewMedicalLogFormProps) {
  const [state, dispatch] = useActionState(createMedicalLogAction, {
    message: "",
    errors: {},
  });
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedMedicineBatches, setSelectedMedicineBatches] = useState<Batch[]>([]);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const form = useForm<MedicalLogFormValues>({
    resolver: zodResolver(MedicalLogSchema),
    defaultValues: {
      shipId,
      date: new Date(),
      crewMemberName: "",
      rank: "",
      caseDescription: "",
      notes: "",
      photoUrl: "",
    },
  });

  const medicineUsedId = form.watch("medicineUsedId");

  useEffect(() => {
    if (medicineUsedId) {
      const selectedItem = inventory.find(item => item.id === medicineUsedId);
      setSelectedMedicineBatches(selectedItem?.batches || []);
      form.setValue("batchUsedId", undefined); // Reset batch when medicine changes
    } else {
      setSelectedMedicineBatches([]);
    }
  }, [medicineUsedId, inventory, form]);


  useEffect(() => {
    if (state.message && !state.errors) {
      toast({
        title: "Success",
        description: state.message,
      });
      onFormSubmit();
      form.reset();
      setDate(new Date());
      setPhotoPreview(null);
    } else if (state.message && state.errors) {
       toast({
        title: "Error",
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state, onFormSubmit, toast, form]);
  
  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setPhotoPreview(dataUrl);
        form.setValue("photoUrl", dataUrl);
      };
      reader.readAsDataURL(file);
    } else {
        setPhotoPreview(null);
        form.setValue("photoUrl", "");
    }
  };


  const medicineInventory = inventory.filter(item => item.type === 'Medicine' && item.totalQuantity > 0);

  return (
    <Form {...form}>
      <form
        ref={formRef}
        action={dispatch}
        className="grid gap-4 py-4"
      >
        <input type="hidden" name="shipId" value={shipId} />
        <input type="hidden" name="photoUrl" value={form.getValues("photoUrl") ?? ""} />
        
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of Incident</FormLabel>
              <input type="hidden" name="date" value={date?.toISOString()} />
              <DatePicker date={date} setDate={setDate} />
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="crewMemberName"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Crew Member Name</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., John Smith" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
             <FormField
            control={form.control}
            name="rank"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Rank</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., Captain" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        
        <FormField
          control={form.control}
          name="caseDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description of Case</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the illness or injury..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="medicineUsedId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Medicine Provided</FormLabel>
               <Select onValueChange={field.onChange} defaultValue={field.value ?? ""}>
                 <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a medicine from inventory" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                    {medicineInventory.map(item => (
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
        
        {medicineUsedId && (
            <div className="grid grid-cols-2 gap-4">
                 <FormField
                    control={form.control}
                    name="batchUsedId"
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
                    name="quantityUsed"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Quantity Used</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="e.g., 2" {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        )}

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

        <FormItem>
            <FormLabel>Attach Photo (optional)</FormLabel>
            <FormControl>
                <Input type="file" accept="image/*" onChange={handlePhotoChange} />
            </FormControl>
            <FormMessage />
        </FormItem>
        
        {photoPreview && (
            <div className="flex justify-center">
                <Image src={photoPreview} alt="Photo preview" width={200} height={200} className="rounded-md object-cover"/>
            </div>
        )}
        
        <Button type="submit" className="w-full">
          Add Log Entry
        </Button>
      </form>
    </Form>
  );
}
