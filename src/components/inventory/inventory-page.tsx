"use client";

import type { InventoryItem } from "@/types";
import { useState } from "react";
import { add } from "date-fns";
import { InventoryTable } from "./inventory-table";
import { InventoryToolbar } from "./inventory-toolbar";
import { ShipInventoryTabs } from "./ship-inventory-tabs";
import { getMedicines } from "@/lib/data";

export function InventoryPage({ inventory, shipId }: { inventory: InventoryItem[], shipId: string }) {
    const [allItems, setAllItems] = useState<any[]>([]);

    const medicines = inventory.filter(item => {
        const masterItem = allItems.find(m => m.id === item.medicineId);
        return masterItem?.type === 'Medicine';
    });

    const equipment = inventory.filter(item => {
        const masterItem = allItems.find(m => m.id === item.medicineId);
        return masterItem?.type === 'Equipment';
    });

  return (
    <ShipInventoryTabs
      medicines={medicines}
      equipment={equipment}
      shipId={shipId}
    />
  );
}
