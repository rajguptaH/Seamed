"use client"; 
import { PharmacistDetailsForm } from "@/components/settings/pharmacist-details-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useData } from "@/context/DataProvider";
import { API_ENTITIES, API_ROUTES } from "@/utils/routes";
import { useEffect, useMemo } from "react";
export default function SettingsPage() {
   const { data,fetchEntity } = useData();
  
    useEffect(() => {
      fetchEntity(API_ENTITIES.pharmacists, API_ROUTES.pharmacists);
    }, [fetchEntity]); 
  
const details = useMemo(() => data.pharmacists?.[0] || null, [data.pharmacists]);
console.log("Pharma Detaisl" ,details)
    return (
      <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Application Settings</CardTitle>
          <CardDescription>
              Manage application-wide static data.
            </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pharmacist Details</CardTitle>
          <CardDescription>
            Update the details for the SEAMED-appointed pharmacist which appear on the Medical Chest Certificate.
          </CardDescription>
        </CardHeader>
        <CardContent>
        {details && <PharmacistDetailsForm details={details} />}

        </CardContent>
      </Card>
    </div>
  );
}
