"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Download, ChevronsRight } from "lucide-react";
import { exportInventoryToExcel } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { downloadFile } from "@/lib/utils";

type ExpiryFilter = "all" | "1m" | "3m" | "6m" | "expired";

interface InventoryToolbarProps {
  currentFilter: ExpiryFilter;
  onFilterChange: (filter: ExpiryFilter) => void;
  shipId: string;
}

const filters: { key: ExpiryFilter; label: string }[] = [
  { key: "all", label: "All Items" },
  { key: "expired", label: "Expired" },
  { key: "1m", label: "Expires in 1 Month" },
  { key: "3m", label: "Expires in 3 Months" },
  { key: "6m", label: "Expires in 6 Months" },
];

export function InventoryToolbar({ currentFilter, onFilterChange, shipId }: InventoryToolbarProps) {
    const { toast } = useToast();

    const handleExport = async () => {
        const result = await exportInventoryToExcel(shipId);
        if (result.success && result.dataUrl) {
            downloadFile(result.dataUrl, result.filename || 'inventory.xlsx');
            toast({
                title: "Export Successful",
                description: "Your inventory has been downloaded.",
            });
        } else {
            toast({
                title: "Export Failed",
                description: result.message || "An unknown error occurred.",
                variant: "destructive",
            });
        }
    }

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-2">
         <span className="text-sm font-medium text-muted-foreground hidden md:inline-flex items-center gap-2">Filter <ChevronsRight className="h-4 w-4" /></span>
        {filters.map(({ key, label }) => (
          <Button
            key={key}
            variant={currentFilter === key ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange(key)}
            className={cn(key === "expired" && currentFilter === "expired" && "bg-destructive text-destructive-foreground hover:bg-destructive/90")}
          >
            {label}
          </Button>
        ))}
      </div>
      <Button size="sm" onClick={handleExport}>
        <Download className="mr-2 h-4 w-4" />
        Export to Excel
      </Button>
    </div>
  );
}
