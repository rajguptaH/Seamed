
"use client";

import React, { useActionState, useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { Flag, FlagRequirement, Medicine } from "@/types";
import { updateFlagRequirementAction } from "@/lib/actions";
import { Save } from "lucide-react";
import { EditMedicineDialog } from "./edit-medicine-dialog";
import { DeleteMedicineDialog } from "./delete-medicine-dialog";
import { NewMedicineDialog } from "./new-medicine-dialog";

interface EditableEquipmentInventoryTableProps {
  requirements: FlagRequirement[];
  items: Medicine[];
  flag: Flag;
}

export function EditableEquipmentInventoryTable({ requirements, items, flag }: EditableEquipmentInventoryTableProps) {
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [pendingChanges, setPendingChanges] = useState<Record<string, { quantity: string }>>({});
  const { toast } = useToast();
  
  const [state, formAction, isPending] = useActionState(updateFlagRequirementAction, { message: "", errors: {}});

  const groupedItems = items.reduce((acc, item) => {
    const category = item.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, Medicine[]>);

   useEffect(() => {
    if (state?.message && !isPending) {
        if (state.errors && Object.keys(state.errors).length > 0) {
            toast({
                title: "Error",
                description: state.message,
                variant: "destructive",
            });
        } else {
            toast({
                title: "Success",
                description: state.message,
            });
            const savedMedicineId = (state.data as any)?.medicineId;
            if (savedMedicineId) {
                setPendingChanges(prev => {
                    const newPending = { ...prev };
                    delete newPending[savedMedicineId];
                    return newPending;
                });
            }
        }
    }
  }, [state, isPending, toast]);

  const handleCellClick = (medicineId: string) => {
    setEditingCell(medicineId);
  };

  const handleInputChange = (medicineId: string, value: string) => {
    setPendingChanges(prev => ({
        ...prev,
        [medicineId]: {
            quantity: value,
        },
    }));
  };

  const handleInputBlur = () => {
     setEditingCell(null);
  };
  
  const categoryOrder = [
    'Resuscitation',
    'Dressing Material and Suturing Equipment',
    'Instruments',
    'Examination and monitoring equipment',
    'Equipment for injection, infusion, and catheterization',
    'General medical and nursing equipment',
    'Immobilization and transport',
    'Uncategorized'
  ];

  const sortedCategories = Object.keys(groupedItems).sort((a, b) => {
      const indexA = categoryOrder.indexOf(a);
      const indexB = categoryOrder.indexOf(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
  });

  return (
    <>
      <div className="flex justify-end items-center mb-4">
          <NewMedicineDialog />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Form</TableHead>
            <TableHead>Strength</TableHead>
            <TableHead>Indication</TableHead>
            <TableHead>Qty</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead className="text-right w-[180px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedCategories.map((category) => (
              <React.Fragment key={category}>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableCell colSpan={7} className="font-bold text-primary">
                          {category}
                      </TableCell>
                  </TableRow>
                  {groupedItems[category].sort((a,b) => a.name.localeCompare(b.name)).map((item) => {
                      const req = requirements.find(r => r.medicineId === item.id);
                      const currentChanges = pendingChanges[item.id];
                      
                      const getDisplayValue = () => {
                          const changedValue = currentChanges?.quantity;
                          if (changedValue !== undefined) {
                          return changedValue;
                          }
                          return req?.quantity ?? '-';
                      };
                      
                      return (
                          <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.form}</TableCell>
                          <TableCell>{item.strength ?? 'N/A'}</TableCell>
                          <TableCell>{item.indication}</TableCell>

                          <TableCell onClick={() => handleCellClick(item.id)}>
                              {editingCell === item.id ? (
                              <Input
                                  defaultValue={getDisplayValue()}
                                  onChange={(e) => handleInputChange(item.id, e.target.value)}
                                  onBlur={handleInputBlur}
                                  autoFocus
                                  className="w-24"
                              />
                              ) : (
                              <span>{getDisplayValue()}</span>
                              )}
                          </TableCell>

                          <TableCell className="text-xs text-muted-foreground">{item.notes ?? 'N/A'}</TableCell>
                          
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                                  {currentChanges && (
                                    <form action={formAction}>
                                      <input type="hidden" name="flag" value={flag} />
                                      <input type="hidden" name="medicineId" value={item.id} />
                                      <input type="hidden" name="quantity" value={currentChanges.quantity ?? req?.quantity ?? '0'} />
                                      <input type="hidden" name="isMedicine" value="false" />
                                      <Button type="submit" variant="ghost" size="icon" disabled={isPending}>
                                          <Save className="h-4 w-4" />
                                      </Button>
                                    </form>
                                  )}
                                  <EditMedicineDialog item={item} />
                                  <DeleteMedicineDialog item={item} />
                              </div>
                          </TableCell>
                          </TableRow>
                      );
                  })}
              </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
