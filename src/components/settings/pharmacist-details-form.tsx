
"use client";

import { useActionState, useEffect, useRef } from "react";
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
import type { PharmacistDetails } from "@/lib/certificate-data";
import { updatePharmacistDetailsAction } from "@/lib/actions";
import { Textarea } from "../ui/textarea";

const PharmacistDetailsSchema = z.object({
  name: z.string().min(3, "Pharmacist name is required."),
  licenseNumber: z.string().min(3, "License number is required."),
  signature: z.string().min(1, "Signature text is required."),
  supplierName: z.string().min(3, "Supplier name is required."),
  supplierAddress: z.string().min(10, "Supplier address is required."),
  supplierStateLicense: z.string().min(1, "State license is required."),
  supplierTel: z.string().min(8, "Supplier telephone is required."),
});

export function PharmacistDetailsForm({ details }: { details: PharmacistDetails }) {
  const [state, dispatch] = useActionState(updatePharmacistDetailsAction, {
    message: "",
    errors: {},
  });
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<z.infer<typeof PharmacistDetailsSchema>>({
    resolver: zodResolver(PharmacistDetailsSchema),
    defaultValues: {
      name: details.name,
      licenseNumber: details.licenseNumber,
      signature: details.signature,
      supplierName: details.supplier.name,
      supplierAddress: details.supplier.address,
      supplierStateLicense: details.supplier.stateLicense,
      supplierTel: details.supplier.tel,
    },
  });

  useEffect(() => {
    if (state.message) {
      if (state.errors) {
        toast({
          title: "Error",
          description: state.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: state.message,
        });
      }
    }
  }, [state, toast]);

  return (
    <Form {...form}>
      <form ref={formRef} action={dispatch} className="grid gap-6">
        <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
                 <h4 className="font-semibold text-md">Pharmacist Information</h4>
                 <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Pharmacist Name</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                <FormField
                    control={form.control}
                    name="licenseNumber"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>License Number</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                <FormField
                    control={form.control}
                    name="signature"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Signature (Printed Name)</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
            </div>
            <div className="space-y-4">
                 <h4 className="font-semibold text-md">Supplier Information</h4>
                 <FormField
                    control={form.control}
                    name="supplierName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Supplier Name</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                 <FormField
                    control={form.control}
                    name="supplierAddress"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Supplier Address</FormLabel>
                        <FormControl>
                            <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                <FormField
                    control={form.control}
                    name="supplierStateLicense"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Supplier State License</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                <FormField
                    control={form.control}
                    name="supplierTel"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Supplier Telephone</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
            </div>
        </div>
        <div className="flex justify-end">
            <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
  );
}
