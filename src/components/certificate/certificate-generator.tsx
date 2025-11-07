
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { pharmacistDetails } from "@/lib/certificate-data";
import type { Ship } from "@/types";
import { FileDown } from "lucide-react";
import { useEffect, useState } from "react";
import { DatePicker } from "../ui/date-picker";
import { PrintableCertificate } from "./printable-certificate";

interface CertificateGeneratorProps {
  ships: Ship[];
}

export function CertificateGenerator({ ships }: CertificateGeneratorProps) {
  const [selectedShipId, setSelectedShipId] = useState<string>("");
  const [inspectionDate, setInspectionDate] = useState<Date | undefined>();
  const [port, setPort] = useState<string>("");

  useEffect(() => {
    // Set the initial date only on the client to avoid hydration mismatch
    setInspectionDate(new Date());
  }, []);

  const selectedShip = ships.find(s => s._id === selectedShipId);

const handlePrint = () => {
  const certificate = document.getElementById("printable-certificate");
  if (!certificate) return;

  const printWindow = window.open("", "_blank", "width=900,height=650");
  if (!printWindow) return;

  // Grab Tailwind base styles from the page
  const tailwindStyles = Array.from(document.querySelectorAll('style')).map(s => s.innerHTML).join('\n');

  printWindow.document.write(`
    <html>
      <head>
        <title>Medical Chest Certificate</title>
        <style>
          ${tailwindStyles} /* Apply Tailwind styles */
          body { background: white; color: black; font-family: serif; margin: 0; padding: 0; }
          #printable-certificate { width: 100%; }
          #printable-certificate .overflow-auto { overflow: visible !important; }
        </style>
      </head>
      <body>
        ${certificate.outerHTML}
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
};

  return (
    <>
      {selectedShip && inspectionDate && (
        <PrintableCertificate
          ship={selectedShip}
          pharmacist={pharmacistDetails}
          inspectionDate={inspectionDate}
          port={port}
        />
      )}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Medical Chest Certificate Generator</CardTitle>
            <CardDescription>
              Select a vessel and enter the inspection details to generate a certificate.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="ship-select">Vessel</Label>
              <Select onValueChange={setSelectedShipId} value={selectedShipId}>
                <SelectTrigger id="ship-select">
                  <SelectValue placeholder="Select a vessel" />
                </SelectTrigger>
                <SelectContent>
                  {ships.map(ship => (
                    <SelectItem key={ship._id} value={ship._id}>
                      {ship.name} (IMO: {ship.imo})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Date of Inspection</Label>
                <DatePicker date={inspectionDate} setDate={setInspectionDate} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="port">Port of Inspection</Label>
                <Input
                  id="port"
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                  placeholder="e.g., KEMEN"
                />
              </div>
            </div>

            <Button onClick={handlePrint} disabled={!selectedShip || !inspectionDate || !port} className="w-full md:w-auto">
              <FileDown className="mr-2 h-4 w-4" />
              Download Certificate
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
