

import { notFound } from "next/navigation";
import Link from "next/link";
import { getShipById, getInventoryForShip, getMedicines, getMedicalLogsForShip, getNonMedicalConsumptionLogsForShip, getCompanyById, getSupplyLogsForShip } from "@/lib/data";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Ship, Users, Notebook, Flag, Bot, Building, Phone, User, Stethoscope } from "lucide-react";
import { ShipInventoryTabs } from "@/components/inventory/ship-inventory-tabs";
import { Badge } from "@/components/ui/badge";
import type { InventoryItem } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MedicalLogTable } from "@/components/medical-log/medical-log-table";
import { NonMedicalConsumptionTable } from "@/components/consumption-log/non-medical-consumption-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SupplyLogTable } from "@/components/supply-log/supply-log-table";

export default async function ShipDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id: shipId } = params;
  const ship = await getShipById(shipId);

  if (!ship) {
    notFound();
  }
  
  const [inventory, allItems, medicalLogs, consumptionLogs, company, supplyLogs] = await Promise.all([
    getInventoryForShip(shipId),
    getMedicines(),
    getMedicalLogsForShip(shipId),
    getNonMedicalConsumptionLogsForShip(shipId),
    getCompanyById(ship.companyId),
    getSupplyLogsForShip(shipId),
  ]);


  const medicines = inventory.filter(item => item.type === 'Medicine' && item.requiredQuantity > 0);
  const equipment = inventory.filter(item => item.type === 'Equipment');
  const nonMandatory = inventory.filter(item => item.type === 'Medicine' && (item.requiredQuantity === 0 || !item.requiredQuantity));


  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6 print:hidden">
        <div className="print:hidden flex items-center gap-4">
          <Button asChild variant="outline" size="sm" className="h-8 gap-1">
            <Link href="/dashboard">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Back to Dashboard
              </span>
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="h-8 gap-1">
            <Link href="/ai-assistant">
              <Bot className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  AI Assistant
                </span>
            </Link>
          </Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-3 print:hidden">
          <div className="md:col-span-2 grid gap-4">
            <h1 className="font-headline text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
              <Ship className="h-7 w-7 text-primary" /> {ship.name}
            </h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                  <Flag className="h-4 w-4" />
                  <span>{ship.flag}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{ship.crewCount} Crew</span>
                </div>
                <p>IMO: {ship.imo}</p>
                  <Badge variant="outline">Category {ship.category}</Badge>
            </div>
          </div>
          {company && (
            <Card className="md:col-span-1">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2"><Building className="h-5 w-5 text-primary" />{company.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                    <p>{company.address}</p>
                    <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> {company.phone}</p>
                    <div className="border-t pt-2 mt-2">
                        <p className="font-semibold text-foreground flex items-center gap-2"><User className="h-4 w-4" /> Person in Charge</p>
                        <p>{company.pic.name}</p>
                        <p>{company.pic.email}</p>
                        <p>{company.pic.phone}</p>
                        {company.pic.phone2 && <p>{company.pic.phone2}</p>}
                    </div>
                     <div className="border-t pt-2 mt-2">
                        <p className="font-semibold text-foreground flex items-center gap-2"><Stethoscope className="h-4 w-4" /> Company Doctor (24/7)</p>
                        <p>{company.doctor.name}</p>
                        <p>{company.doctor.email}</p>
                        <p>{company.doctor.phone}</p>
                        {company.doctor.phone2 && <p>{company.doctor.phone2}</p>}
                    </div>
                </CardContent>
            </Card>
           )}
        </div>

        <Tabs defaultValue="inventory" className="w-full print:hidden">
            <TabsList>
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                <TabsTrigger value="medical-log">Medical Log</TabsTrigger>
                <TabsTrigger value="consumption-log">Non-Medical Consumption</TabsTrigger>
                <TabsTrigger value="supply-log">Supply Log</TabsTrigger>
            </TabsList>
            <TabsContent value="inventory">
              <ShipInventoryTabs
                medicines={medicines}
                equipment={equipment}
                nonMandatory={nonMandatory}
                shipId={ship.id}
                allItems={allItems}
              />
            </TabsContent>
             <TabsContent value="medical-log">
                <MedicalLogTable ship={ship} inventory={inventory} logs={medicalLogs} company={company} />
            </TabsContent>
            <TabsContent value="consumption-log">
                <NonMedicalConsumptionTable ship={ship} inventory={inventory} logs={consumptionLogs} />
            </TabsContent>
            <TabsContent value="supply-log">
                <SupplyLogTable shipId={ship.id} logs={supplyLogs} allMedicines={allItems} />
            </TabsContent>
        </Tabs>
        
        <div className="hidden print:block">
            <MedicalLogTable ship={ship} inventory={inventory} logs={medicalLogs} company={company} />
        </div>

      </main>
    </div>
  );
}
