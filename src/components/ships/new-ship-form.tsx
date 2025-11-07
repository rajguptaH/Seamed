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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useData } from "@/context/DataProvider";
import { useToast } from "@/hooks/use-toast";
import { createShipAction } from "@/lib/actions";
import { Company, Flag, VesselCategory } from "@/types";
import { API_ENTITIES, API_ROUTES } from "@/utils/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const ShipSchema = z.object({
  name: z.string().min(3, "Ship name must be at least 3 characters long."),
  imo: z.string().length(7, "IMO number must be 7 characters."),
  flag: z.enum(["Panama", "Liberia", "Marshall Islands", "Hong Kong", "Singapore", "India", "Cayman Islands"], {
    errorMap: () => ({ message: "Please select a valid flag." }),
  }),
  crewCount: z.coerce.number().int().positive("Crew count must be a positive number."),
  companyId: z.string().min(1, "Please select a company."),
  category: z.enum(['A', 'B', 'C'], {
    errorMap: () => ({ message: "Please select a vessel category." }),
  }),
});

const flags: Flag[] = ["Panama", "Liberia", "Marshall Islands", "Hong Kong", "Singapore", "India", "Cayman Islands"];
const categories: VesselCategory[] = ['A', 'B', 'C'];

export function NewShipForm({ companies, onFormSubmit }: { companies: Company[]; onFormSubmit: () => void }) {
  const [state, dispatch] = useActionState(createShipAction, {
    message: "",
    errors: {},
  });
    const { createEntity } = useData();
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<z.infer<typeof ShipSchema>>({
    resolver: zodResolver(ShipSchema),
    defaultValues: {
      name: "",
      imo: "",
      crewCount: 10,
      companyId: "",
      category: 'A',
    },
  });

 const onSubmit = async (values: z.infer<typeof ShipSchema>) => {
    try {
      await createEntity(API_ENTITIES.ships, API_ROUTES.ships, values);
      toast({ title: "Success", description: "Ship added successfully!" });
      form.reset();
      onFormSubmit();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };
  return (
    <Form {...form}>
      <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)}  className="grid gap-4 py-4">
        <FormField
          control={form.control}
          name="companyId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vessel Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., The Sea Explorer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>IMO Number</FormLabel>
              <FormControl>
                <Input placeholder="7-digit number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="flag"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Flag</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a flag" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {flags.map((flag) => (
                    <SelectItem key={flag} value={flag}>
                      {flag}
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
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vessel Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      Category {cat}
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
          name="crewCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Crew</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Add Ship
        </Button>
      </form>
    </Form>
  );
}
