
"use client";

import type { InventoryItem, Medicine } from "@/types";
import { useState } from "react";
import { add } from "date-fns";
import { InventoryTable } from "./inventory-table";
import { InventoryToolbar } from "./inventory-toolbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NonMandatoryInventoryTable } from "./non-mandatory-inventory-table";


type ExpiryFilter = "all" | "1m" | "3m" | "6m" | "expired";

interface ShipInventoryTabsProps {
  medicines: InventoryItem[];
  equipment: InventoryItem[];
  nonMandatory: InventoryItem[];
  shipId: string;
  allItems: Medicine[];
}

export function ShipInventoryTabs({ medicines, equipment, nonMandatory, shipId, allItems }: ShipInventoryTabsProps) {
  const [filter, setFilter] = useState<ExpiryFilter>("all");

  const filterInventory = (inventory: InventoryItem[]) => {
    if (filter === 'all') return inventory;
    
    return inventory.filter((item) => {
      // An item matches if at least one of its batches matches the filter.
      return item.batches.some(batch => {
        if (!batch.expiryDate) return false;

        const now = new Date();
        const expiryDate = new Date(batch.expiryDate);

        if (filter === "expired") {
          return expiryDate < now;
        }
        if (filter === "1m") {
          return expiryDate >= now && expiryDate <= add(now, { months: 1 });
        }
        if (filter === "3m") {
          return expiryDate >= now && expiryDate <= add(now, { months: 3 });
        }
        if (filter === "6m") {
          return expiryDate >= now && expiryDate <= add(now, { months: 6 });
        }
        return false;
      })
    }).map(item => {
      // if not filtering by all, we also filter the batches inside the item
      const filteredBatches = item.batches.filter(batch => {
         if (!batch.expiryDate) return false;

        const now = new Date();
        const expiryDate = new Date(batch.expiryDate);

        if (filter === "expired") {
          return expiryDate < now;
        }
        if (filter === "1m") {
          return expiryDate >= now && expiryDate <= add(now, { months: 1 });
        }
        if (filter === "3m") {
          return expiryDate >= now && expiryDate <= add(now, { months: 3 });
        }
        if (filter === "6m") {
          return expiryDate >= now && expiryDate <= add(now, { months: 6 });
        }
        return true;
      });
      return {...item, batches: filteredBatches};
    });
  }

  const filteredMedicines = filterInventory(medicines);
  const filteredEquipment = filterInventory(equipment);
  const filteredNonMandatory = filterInventory(nonMandatory);

  return (
    <div className="space-y-4">
      <InventoryToolbar
        currentFilter={filter}
        onFilterChange={setFilter}
        shipId={shipId}
      />
       <Tabs defaultValue="medicines" className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-auto">
                <TabsTrigger value="medicines">Medicines ({filteredMedicines.length})</TabsTrigger>
                <TabsTrigger value="equipment">Equipment ({filteredEquipment.length})</TabsTrigger>
                <TabsTrigger value="non-mandatory">Non-Mandatory ({nonMandatory.flatMap(i => i.batches).length})</TabsTrigger>
            </TabsList>
            <TabsContent value="medicines">
                <InventoryTable inventory={filteredMedicines} shipId={shipId} />
            </TabsContent>
            <TabsContent value="equipment">
                <InventoryTable inventory={filteredEquipment} shipId={shipId}/>
            </TabsContent>
            <TabsContent value="non-mandatory">
                <NonMandatoryInventoryTable inventory={nonMandatory} shipId={shipId} allMedicines={allItems}/>
            </TabsContent>
        </Tabs>
    </div>
  );
}
