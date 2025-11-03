
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PharmacistDetailsForm } from "@/components/settings/pharmacist-details-form";
import { pharmacistDetails } from "@/lib/certificate-data";

export default function SettingsPage() {
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
          <PharmacistDetailsForm details={pharmacistDetails} />
        </CardContent>
      </Card>
    </div>
  );
}
