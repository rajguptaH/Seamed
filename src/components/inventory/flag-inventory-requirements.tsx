import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useData } from "@/context/DataProvider";
import { IFlag } from "@/types";
import { API_ENTITIES, API_ROUTES } from "@/utils/routes";
import { useEffect, useMemo } from "react";
import { EditableEquipmentInventoryTable } from "./editable-equipment-inventory-table";
import { EditableFlagInventoryTable } from "./editable-flag-inventory-table";

export function FlagInventoryRequirements() {
  const { data, fetchEntity } = useData();
  console.log("Data in flag inventory" ,data)
  useEffect(() => {
    fetchEntity(API_ENTITIES.flagRequirements, API_ROUTES.flagRequirements);
    fetchEntity(API_ENTITIES.medicines, API_ROUTES.medicines);
    
  }, [fetchEntity]);
const flagRequirements = useMemo(() => data["flag-requirements"] || [], [data["flag-requirements"]]);
console.log("Flags requirement", flagRequirements);

  console.log("Flags requirement" ,flagRequirements)
  const allItems = useMemo(() => data.medicines || [], [data.medicines]);
  const flags = Object.keys(flagRequirements) as IFlag[];
  const medicines = allItems.filter(item => item.type === 'Medicine');
  const equipments = allItems.filter(item => item.type === 'Equipment');
console.log("Flags " ,flags)
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Flag State Requirements</CardTitle>
          <CardDescription>
            Medical inventory standards for each flag state. Click a quantity to edit.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={flags[0]} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7 h-auto">
            {flags.map((flag) => (
              <TabsTrigger key={flag} value={flag}>{flag}</TabsTrigger>
            ))}
          </TabsList>
          {flags.map((flag) => (
            <TabsContent key={flag} value={flag} className="mt-4">
              <Tabs defaultValue="medicines" className="w-full">
                <div className="flex justify-between items-center mb-4">
                  <TabsList>
                    <TabsTrigger value="medicines">Medicines</TabsTrigger>
                    <TabsTrigger value="equipment">Equipment</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="medicines">
                  <EditableFlagInventoryTable
                    requirements={flagRequirements[flag]}
                    items={medicines}
                    flag={flag}
                  />
                </TabsContent>
                <TabsContent value="equipment">
                  <EditableEquipmentInventoryTable
                    requirements={flagRequirements[flag]}
                    items={equipments}
                    flag={flag}
                  />
                </TabsContent>
              </Tabs>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
