
"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format, isWithinInterval } from "date-fns";
import { NewMedicalLogDialog } from "./new-medical-log-dialog";
import { DatePicker } from "../ui/date-picker";
import type { InventoryItem, MedicalLog, Ship, Company } from "@/types";
import { Printer, Download, FileDown } from "lucide-react";
import { PrintableMedicalLog } from "./printable-medical-log";
import { exportMedicalLogToExcel } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { downloadFile } from "@/lib/utils";

export function MedicalLogTable({ ship, inventory, logs, company }: { ship: Ship, inventory: InventoryItem[], logs: MedicalLog[], company?: Company }) {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const { toast } = useToast();

  const getMedicineName = (medicineId: string | null | undefined) => {
    if (!medicineId) return 'N/A';
    const inventoryItem = inventory.find(item => item.id === medicineId || item.medicineId === medicineId);
    return inventoryItem?.medicineName || 'Unknown';
  };

  const filteredLogs = useMemo(() => {
    if (!startDate || !endDate) {
      return logs;
    }
    return logs.filter(log => {
      const logDate = new Date(log.date);
      return isWithinInterval(logDate, { start: startDate, end: endDate });
    });
  }, [logs, startDate, endDate]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadExcel = async () => {
    const result = await exportMedicalLogToExcel(ship.id, startDate, endDate);
    if (result.success && result.dataUrl) {
        downloadFile(result.dataUrl, result.filename || 'medical_log.xlsx');
        toast({
            title: "Export Successful",
            description: "Your medical log has been downloaded as an Excel file.",
        });
    } else {
        toast({
            title: "Export Failed",
            description: result.message || "An unknown error occurred.",
            variant: "destructive",
        });
    }
  };

  return (
    <>
      <PrintableMedicalLog logs={filteredLogs} ship={ship} company={company} getMedicineName={getMedicineName} />
      <Card className="print:hidden">
        <CardHeader className="flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
              <CardTitle>Medical Log</CardTitle>
              <CardDescription>
              A record of all medical incidents and treatments on this vessel.
              </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <NewMedicalLogDialog shipId={ship.id} inventory={inventory} />
            <Button variant="outline" size="sm" onClick={handlePrint} className="h-9 gap-1">
              <FileDown className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Download PDF
              </span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadExcel} className="h-9 gap-1">
              <Download className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Download Excel
              </span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="grid gap-2">
              <span className="text-sm font-medium">Start Date</span>
              <DatePicker date={startDate} setDate={setStartDate} />
            </div>
            <div className="grid gap-2">
              <span className="text-sm font-medium">End Date</span>
              <DatePicker date={endDate} setDate={setEndDate} />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Crew Member</TableHead>
                <TableHead>Rank</TableHead>
                <TableHead>Case Description</TableHead>
                <TableHead>Medicine Provided</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Batch #</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Photo</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{format(log.date, "PPP")}</TableCell>
                    <TableCell>{log.crewMemberName}</TableCell>
                    <TableCell>{log.rank}</TableCell>
                    <TableCell>{log.caseDescription}</TableCell>
                    <TableCell>{getMedicineName(log.medicineUsedId)}</TableCell>
                    <TableCell>{log.quantityUsed ?? 'N/A'}</TableCell>
                    <TableCell>{log.batchNumber || 'N/A'}</TableCell>
                    <TableCell>{log.expiryDate ? format(log.expiryDate, "PPP") : 'N/A'}</TableCell>
                    <TableCell>
                      {log.photoUrl ? (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Image src={log.photoUrl} alt="Medical log photo" width={40} height={40} className="rounded-md object-cover cursor-pointer" />
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                             <Image src={log.photoUrl} alt="Medical log photo" width={800} height={600} className="rounded-md object-contain" />
                          </DialogContent>
                        </Dialog>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                    <TableCell>{log.notes || 'N/A'}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} className="h-24 text-center">
                    No medical log entries found for the selected period.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
