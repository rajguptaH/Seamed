

"use client";

import { useState } from "react";
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
import { format } from "date-fns";
import { NewSupplyLogDialog } from "./new-supply-log-dialog";
import type { SupplyLog, SupplyLogStatus, Medicine } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { downloadFile } from "@/lib/utils";
import { SupplyLogDetailsDialog } from "./supply-log-details-dialog";

interface SupplyLogTableProps { 
    shipId: string;
    logs: SupplyLog[];
    allMedicines: Medicine[];
}

const statusVariant: Record<SupplyLogStatus, "default" | "secondary" | "destructive" | "outline"> = {
    Pending: "outline",
    Shipped: "default",
    Delivered: "secondary",
    Cancelled: "destructive",
};

export function SupplyLogTable({ shipId, logs, allMedicines }: SupplyLogTableProps) {
  const [selectedLog, setSelectedLog] = useState<SupplyLog | null>(null);

  return (
    <>
      {selectedLog && (
        <SupplyLogDetailsDialog 
          log={selectedLog}
          shipId={shipId}
          allMedicines={allMedicines}
          open={!!selectedLog}
          onOpenChange={(isOpen) => !isOpen && setSelectedLog(null)}
        />
      )}
      <Card>
        <CardHeader className="flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
              <CardTitle>Supply Log</CardTitle>
              <CardDescription>
              A record of all medicine supply shipments for this vessel. Click a row to see details.
              </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <NewSupplyLogDialog shipId={shipId} />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Port of Supply</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Tracking #</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Order List</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length > 0 ? (
                logs.map((log) => (
                  <TableRow key={log.id} onClick={() => setSelectedLog(log)} className="cursor-pointer">
                    <TableCell>{format(log.date, "PPP")}</TableCell>
                    <TableCell>{log.portOfSupply}</TableCell>
                    <TableCell>{log.supplierName}</TableCell>
                    <TableCell>{log.trackingNumber || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[log.status]}>{log.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {log.orderListUrl ? (
                          <Button 
                              variant="link" 
                              className="p-0 h-auto"
                              onClick={(e) => {
                                e.stopPropagation(); // prevent row click
                                downloadFile(log.orderListUrl!, log.orderListFilename || 'order-list')
                              }}
                          >
                              View
                          </Button>
                      ) : 'N/A'}
                    </TableCell>
                    <TableCell>{log.notes || 'N/A'}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No supply log entries found.
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
