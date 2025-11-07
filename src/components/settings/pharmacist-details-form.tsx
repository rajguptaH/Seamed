
"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { updatePharmacistDetailsAction } from "@/lib/actions";
import type { PharmacistDetails } from "@/lib/certificate-data";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "../ui/textarea";


import { useData } from "@/context/DataProvider";
import { API_ENTITIES, API_ROUTES } from "@/utils/routes";
const PharmacistDetailsSchema = z.object({
  _id: z.string().optional(),
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
  const { updateEntity } = useData()
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

const form = useForm<z.infer<typeof PharmacistDetailsSchema>>({
  resolver: zodResolver(PharmacistDetailsSchema),
  defaultValues: {
    _id: details._id, // ✅ make sure this is a valid ObjectId
    name: details.name,
    licenseNumber: details.licenseNumber,
    signature: details.signature,
    supplierName: details.supplier.name,
    supplierAddress: details.supplier.address,
    supplierStateLicense: details.supplier.stateLicense,
    supplierTel: details.supplier.tel,
  },
});


  async function onSubmit(values: z.infer<typeof PharmacistDetailsSchema>) {
    console.log("Fprm Submit" ,values)
    try {
      const payload = {
        name: values.name,
        licenseNumber: values.licenseNumber,
        signature: values.signature,
        supplier: {
          name: values.supplierName,
          address: values.supplierAddress,
          stateLicense: values.supplierStateLicense,
          tel: values.supplierTel,
        },
      };

      await updateEntity(
        API_ENTITIES.pharmacists,
        API_ROUTES.pharmacists,
         values._id!,
        payload
      );

      toast({
        title: "Success",
        description: "Pharmacist details updated successfully!",
      });

      // onFormSubmit();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update pharmacist details.",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
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
