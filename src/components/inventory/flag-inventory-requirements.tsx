import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getFlagRequirements, getMedicines } from "@/lib/data";
import { Flag } from "@/types";
import { EditableFlagInventoryTable } from "./editable-flag-inventory-table";
import { EditableEquipmentInventoryTable } from "./editable-equipment-inventory-table";

export async function FlagInventoryRequirements() {
  const [flagRequirements, allItems] = await Promise.all([
    getFlagRequirements(),
    getMedicines()
  ]);
  const flags = Object.keys(flagRequirements) as Flag[];
  const medicines = allItems.filter(item => item.type === 'Medicine');
  const equipments = allItems.filter(item => item.type === 'Equipment');

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
