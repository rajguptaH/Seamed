"use client";

import { differenceInDays, isBefore } from "date-fns";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { CompanyDashboard } from "@/components/companies/company-dashboard";
import { DashboardSummary } from "@/components/dashboard/dashboard-summary";
import { FlagInventoryRequirements } from "@/components/inventory/flag-inventory-requirements";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useData } from "@/context/DataProvider";
import { API_ENTITIES, API_ROUTES } from "@/utils/routes";

export default function DashboardClient() {
  const { data, fetchEntity } = useData();
  const [shipsNeedingAttention, setShipsNeedingAttention] = useState<any[]>([]);
  const [inventoryChecked, setInventoryChecked] = useState(false);
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter");

  // ✅ Fetch once when mounted
  useEffect(() => {
    fetchEntity(API_ENTITIES.ships, API_ROUTES.ships);
    fetchEntity(API_ENTITIES.companies, API_ROUTES.companies);
  }, [fetchEntity]);

  const allShips = useMemo(() => data.ships || [], [data.ships]);
  const companies = useMemo(() => data.companies || [], [data.companies]);

  // ✅ Only check inventory once after ships are fetched
  useEffect(() => {
    if (inventoryChecked || allShips.length === 0) return;

    const checkInventory = async () => {
      const shipsWithIssues = [];

      for (const ship of allShips) {
        const inventory = await fetchEntity(
          API_ENTITIES.ships,
          `/api/ships/${ship._id}/inventory`
        );

        const hasUrgentItem = inventory.some((item: any) =>
          item.batches.some((batch: any) => {
            if (!batch.expiryDate) return false;
            const now = new Date();
            const expiryDate = new Date(batch.expiryDate);
            const daysUntilExpiry = differenceInDays(expiryDate, now);
            return isBefore(expiryDate, now) || daysUntilExpiry <= 30;
          })
        );

        if (hasUrgentItem) shipsWithIssues.push(ship);
      }

      setShipsNeedingAttention(shipsWithIssues);
      setInventoryChecked(true); // ✅ prevents re-run
    };

    checkInventory();
  }, [allShips, inventoryChecked, fetchEntity]);

  // ✅ Derived values
  const shipsNeedingAttentionIds = new Set(
    shipsNeedingAttention.map((s) => s.id)
  );

  const shipsToShow =
    filter === "needs_attention"
      ? allShips.filter((ship) => shipsNeedingAttentionIds.has(ship.id))
      : allShips;

  const totalCrew = allShips.reduce((acc, ship) => acc + (ship.crewCount || 0), 0);
  const shipsWithExpiringItems = shipsNeedingAttention.length;
  const shipsNeedingAttentionNames = shipsNeedingAttention.map((s) => s.name);

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
