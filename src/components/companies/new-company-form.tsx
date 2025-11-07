
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
import { useData } from "@/context/DataProvider";
import { useToast } from "@/hooks/use-toast";
import { createCompanyAction } from "@/lib/actions";
import { API_ENTITIES, API_ROUTES } from "@/utils/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "../ui/textarea";

const CompanySchema = z.object({
  name: z.string().min(3, "Company name must be at least 3 characters long."),
  address: z.string().min(10, "Address must be at least 10 characters long."),
  phone: z.string().min(10, "Phone number must be at least 10 characters long."),
  medicalLogFormNumber: z.string().optional(),
  picName: z.string().min(3, "PIC name is required."),
  picEmail: z.string().email("Invalid email for PIC."),
  picPhone: z.string().min(10, "PIC phone number is required."),
  picPhone2: z.string().optional(),
  doctorName: z.string().min(3, "Doctor name is required."),
  doctorEmail: z.string().email("Invalid email for Doctor."),
  doctorPhone: z.string().min(10, "Doctor phone number is required."),
  doctorPhone2: z.string().optional(),
});

export function NewCompanyForm({ onFormSubmit }: { onFormSubmit: () => void }) {
  const [state, dispatch] = useActionState(createCompanyAction, {
    message: "",
    errors: {},
  });
  const {createEntity} = useData();
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<z.infer<typeof CompanySchema>>({
    resolver: zodResolver(CompanySchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      medicalLogFormNumber: "",
      picName: "",
      picEmail: "",
      picPhone: "",
      picPhone2: "",
      doctorName: "",
      doctorEmail: "",
      doctorPhone: "",
      doctorPhone2: "",
    },
  });const onSubmit = async (values: z.infer<typeof CompanySchema>) => {
  try {
    const payload = {
      name: values.name,
      address: values.address,
      phone: values.phone,
      medicalLogFormNumber: values.medicalLogFormNumber,
      pic: {
        name: values.picName,
        email: values.picEmail,
        phone: values.picPhone,
        phone2: values.picPhone2 || "",
      },
      doctor: {
        name: values.doctorName,
        email: values.doctorEmail,
        phone: values.doctorPhone,
        phone2: values.doctorPhone2 || "",
      },
    };

    await createEntity(API_ENTITIES.companies, API_ROUTES.companies, payload);

    toast({ title: "Success", description: "Company added successfully!" });
    form.reset();
    onFormSubmit();
  } catch (error: any) {
    toast({ title: "Error", description: error.message, variant: "destructive" });
  }
};

  return (
    <Form {...form}>
      <form ref={formRef}  onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Global Maritime Group" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Address</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g., 123 Ocean Ave, Maritime City, 12345" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Phone</FormLabel>
              <FormControl>
                <Input placeholder="e.g., +1-234-567-8901" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="medicalLogFormNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Medical Log Form Number</FormLabel>
              <FormControl>
                <Input placeholder="e.g., COMP-MED-001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <h4 className="font-semibold text-md border-t pt-4 mt-2">Person in Charge (PIC)</h4>
         <FormField
          control={form.control}
          name="picName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>PIC Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., John Admin" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="picEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>PIC Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="e.g., admin@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="picPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>PIC Phone</FormLabel>
              <FormControl>
                <Input placeholder="e.g., +1-234-567-8902" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="picPhone2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>PIC Phone 2 (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., +1-234-567-8904" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <h4 className="font-semibold text-md border-t pt-4 mt-2">Company Doctor (24/7)</h4>
        <FormField
          control={form.control}
          name="doctorName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Doctor Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Dr. Smith" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="doctorEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Doctor Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="e.g., doctor@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="doctorPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Doctor Phone (24/7)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., +1-234-567-8903" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="doctorPhone2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Doctor Phone 2 (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., +1-234-567-8905" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full mt-4">
          Add Company
        </Button>
      </form>
    </Form>
  );
}
