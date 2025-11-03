

"use client";

import React, { useState, useEffect } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { InventoryItem, Batch } from "@/types";
import { differenceInDays, isBefore, format } from "date-fns";
import { cn } from "@/lib/utils";
import { EditBatchDialog } from "./edit-batch-dialog";
import { AddBatchDialog } from "./add-batch-dialog";
import { DeleteBatchDialog } from "./delete-batch-dialog";
import { ChevronDown, AlertTriangle, PlusCircle } from "lucide-react";

function ExpiryBadge({ expiryDate }: { expiryDate: Date | null }) {
  const [expiryInfo, setExpiryInfo] = useState<{
    text: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    formattedDate: string;
  } | null>(null);

  useEffect(() => {
    if (!expiryDate) {
      setExpiryInfo({ text: "N/A", variant: "secondary", formattedDate: "N/A" });
      return;
    }

    const now = new Date();
    const date = new Date(expiryDate);
    const daysUntilExpiry = differenceInDays(date, now);

    let variant: "destructive" | "outline" | "secondary" = "secondary";
    let text = `Expires in ${daysUntilExpiry}d`;

    if (isBefore(date, now)) {
      variant = "destructive";
      text = `Expired`;
    } else if (daysUntilExpiry <= 30) {
      variant = "destructive";
    } else if (daysUntilExpiry <= 90) {
      variant = "outline";
    }

    setExpiryInfo({ text, variant, formattedDate: format(date, "PPP") });
  }, [expiryDate]);

  if (!expiryInfo) return null;

  if (!expiryDate) {
    return <Badge variant="secondary">N/A</Badge>;
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <span>{expiryInfo.formattedDate}</span>
      <Badge variant={expiryInfo.variant}>{expiryInfo.text}</Badge>
    </div>
  );
}

export function InventoryTable({ inventory, shipId }: { inventory: InventoryItem[], shipId: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Medical Inventory</CardTitle>
        <CardDescription>
          Expand items to view and manage individual batches.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="w-full">
          <div className="hidden lg:flex px-4 py-2 text-sm font-medium text-muted-foreground bg-muted/50 rounded-t-lg">
             <div className="w-2/5">Medicine/Equipment</div>
             <div className="w-1/5 text-center">Onboard Qty</div>
             <div className="w-1/5 text-center">Required Qty</div>
             <div className="w-1/5 text-right">Status</div>
          </div>
          {inventory.length > 0 ? (
            inventory.map((item) => (
              <AccordionItem value={item.id} key={item.id}>
                <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 data-[state=open]:bg-muted/50 transition-colors">
                  <div className="flex w-full items-center">
                     <div className="w-2/5 text-left font-medium">{item.medicineName}</div>
                     <div className="w-1/5 text-center">{item.totalQuantity}</div>
                     <div className="w-1/5 text-center">{item.requiredQuantity}</div>
                     <div className="w-1/5 flex justify-end">
                        {item.totalQuantity < item.requiredQuantity && (
                           <Badge variant="destructive">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Low Stock
                           </Badge>
                        )}
                         {item.totalQuantity === 0 && item.requiredQuantity > 0 && (
                           <Badge variant="destructive">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Out of Stock
                           </Badge>
                         )}
                        {item.totalQuantity >= item.requiredQuantity && <Badge variant="secondary">Sufficient</Badge>}
                     </div>
                  </div>
                   <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 text-muted-foreground mr-2" />
                </AccordionTrigger>
                <AccordionContent>
                  <div className="bg-background border-t">
                    <div className="px-4 py-2 flex justify-between items-center">
                        <p className="text-sm font-semibold">Batches</p>
                        <AddBatchDialog inventoryItemId={item.id} shipId={shipId} />
                    </div>
                    {item.batches.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Manufacturer's Name</TableHead>
                            <TableHead>Batch Number</TableHead>
                            <TableHead>Expiry Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {item.batches.map((batch) => (
                            <TableRow key={batch.id}>
                              <TableCell>{batch.quantity}</TableCell>
                              <TableCell>{batch.manufacturerName || "N/A"}</TableCell>
                              <TableCell>{batch.batchNumber || "N/A"}</TableCell>
                              <TableCell>
                                <ExpiryBadge expiryDate={batch.expiryDate} />
                              </TableCell>
                              <TableCell className="text-right">
                                  <div className="flex items-center justify-end">
                                    <EditBatchDialog batch={batch} />
                                    <DeleteBatchDialog batchId={batch.id} shipId={shipId} />
                                  </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                       <div className="text-center text-sm text-muted-foreground p-4">No batches found for this item.</div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))
          ) : (
             <div className="text-center text-sm text-muted-foreground p-8">
                No items match the current filter.
              </div>
          )}
        </Accordion>
      </CardContent>
    </Card>
  );
}
