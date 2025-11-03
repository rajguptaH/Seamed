

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
import { createSupplyLogAction } from "@/lib/actions";
import { DatePicker } from "../ui/date-picker";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { SupplyLogStatuses, type SupplyLogStatus } from "@/types";

const SupplyLogSchema = z.object({
  shipId: z.string(),
  date: z.date(),
  portOfSupply: z.string().min(1, "Port of supply is required."),
  supplierName: z.string().min(1, "Supplier name is required."),
  trackingNumber: z.string().optional().nullable(),
  status: z.enum(SupplyLogStatuses),
  notes: z.string().optional().nullable(),
  orderListUrl: z.string().optional().nullable(),
  orderListFilename: z.string().optional().nullable(),
});

type FormValues = z.infer<typeof SupplyLogSchema>;

interface NewSupplyLogFormProps {
  shipId: string;
  onFormSubmit: () => void;
}

export function NewSupplyLogForm({ shipId, onFormSubmit }: NewSupplyLogFormProps) {
  const [state, dispatch] = useActionState(createSupplyLogAction, {
    message: "",
    errors: {},
  });
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [orderListFile, setOrderListFile] = useState<{name: string, dataUrl: string} | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(SupplyLogSchema),
    defaultValues: {
      shipId,
      date: new Date(),
      status: 'Pending',
      notes: "",
      portOfSupply: "",
      supplierName: "",
      trackingNumber: ""
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
      setDate(new Date());
      setOrderListFile(null);
    } else if (state.message && state.errors) {
       toast({
        title: "Error",
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state, onFormSubmit, toast, form]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setOrderListFile({ name: file.name, dataUrl });
        form.setValue("orderListUrl", dataUrl);
        form.setValue("orderListFilename", file.name);
      };
      reader.readAsDataURL(file);
    } else {
        setOrderListFile(null);
        form.setValue("orderListUrl", "");
        form.setValue("orderListFilename", "");
    }
  };
  
  return (
    <Form {...form}>
      <form
        ref={formRef}
        action={dispatch}
        className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2"
      >
        <input type="hidden" name="shipId" value={shipId} />
        <input type="hidden" name="orderListUrl" value={form.getValues("orderListUrl") ?? ""} />
        <input type="hidden" name="orderListFilename" value={form.getValues("orderListFilename") ?? ""} />
        
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of Supply</FormLabel>
              <input type="hidden" name="date" value={date?.toISOString()} />
              <DatePicker date={date} setDate={setDate} />
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="portOfSupply"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Port of Supply</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Singapore" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="supplierName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Supplier Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Acme Medical Supplies" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="trackingNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tracking Number (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 1Z9999999999999999" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

         <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
               <Select onValueChange={field.onChange} defaultValue={field.value ?? "Pending"}>
                 <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                    {SupplyLogStatuses.map(status => (
                        <SelectItem key={status} value={status}>
                            {status}
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

        <FormItem>
          <FormLabel>Attach Order List (Optional)</FormLabel>
          <FormControl>
            <Input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileChange} />
          </FormControl>
          <FormMessage />
        </FormItem>

        {orderListFile && (
          <div className="text-sm text-muted-foreground">
            Attached: {orderListFile.name}
          </div>
        )}

        <Button type="submit" className="w-full">
          Record Supply
        </Button>
      </form>
    </Form>
  );
}
