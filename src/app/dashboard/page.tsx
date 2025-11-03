

import { getShips, getInventoryForShip, getCompanies } from "@/lib/data";
import { DashboardSummary } from "@/components/dashboard/dashboard-summary";
import { FlagInventoryRequirements } from "@/components/inventory/flag-inventory-requirements";
import { CompanyDashboard } from "@/components/companies/company-dashboard";
import { differenceInDays, isBefore } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Ship } from "@/types";


export default async function DashboardPage({
    searchParams,
}: {
    searchParams?: {
        filter?: string;
    };
}) {
  const [allShips, companies] = await Promise.all([
    getShips(),
    getCompanies(),
  ]);
  
  const shipsNeedingAttention: Ship[] = [];

  for (const ship of allShips) {
    const inventory = await getInventoryForShip(ship.id);
    const hasUrgentItem = inventory.some(item => {
        return item.batches.some(batch => {
            if (!batch.expiryDate) return false;
            const now = new Date();
            const expiryDate = new Date(batch.expiryDate);
            const daysUntilExpiry = differenceInDays(expiryDate, now);
            return isBefore(expiryDate, now) || daysUntilExpiry <= 30;
        });
    });
    if (hasUrgentItem) {
        shipsNeedingAttention.push(ship);
    }
  }
  
  const shipsNeedingAttentionIds = new Set(shipsNeedingAttention.map(s => s.id));

  const shipsToShow = searchParams?.filter === 'needs_attention'
    ? allShips.filter(ship => shipsNeedingAttentionIds.has(ship.id))
    : allShips;

  const totalCrew = allShips.reduce((acc, ship) => acc + (ship.crewCount || 0), 0);
  const shipsWithExpiringItems = shipsNeedingAttention.length;
  const shipsNeedingAttentionNames = shipsNeedingAttention.map(s => s.name);


  return (
    <>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <DashboardSummary 
                totalShips={allShips.length}
                shipsNeedingAttention={shipsWithExpiringItems}
                shipsNeedingAttentionNames={shipsNeedingAttentionNames}
                totalCrew={totalCrew}
            />
        </div>

        <Tabs defaultValue="fleet" className="w-full">
            <TabsList>
                <TabsTrigger value="fleet">My Fleet</TabsTrigger>
                <TabsTrigger value="requirements">Flag Requirements</TabsTrigger>
            </TabsList>
            <TabsContent value="fleet">
                <CompanyDashboard companies={companies} ships={shipsToShow} />
            </TabsContent>
            <TabsContent value="requirements">
                 <FlagInventoryRequirements />
            </TabsContent>
        </Tabs>
    </>
  );
}
