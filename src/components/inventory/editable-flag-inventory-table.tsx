"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { updateFlagRequirementAction } from "@/lib/actions";
import type { Flag, FlagRequirement, Medicine } from "@/types";
import { Save } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { DeleteMedicineDialog } from "./delete-medicine-dialog";
import { EditMedicineDialog } from "./edit-medicine-dialog";
import { NewMedicineDialog } from "./new-medicine-dialog";

interface EditableFlagInventoryTableProps {
  requirements: FlagRequirement[];
  items: Medicine[];
  flag: Flag;
}

type EditableField = 'categoryA' | 'categoryB' | 'categoryC';

export function EditableFlagInventoryTable({ requirements, items, flag }: EditableFlagInventoryTableProps) {
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [pendingChanges, setPendingChanges] = useState<Record<string, Partial<Record<EditableField, string>>>>({});
  const { toast } = useToast();
  
  const [state, formAction, isPending] = useActionState(updateFlagRequirementAction, { message: "", errors: {}});

  const sortedItems = [...items].sort((a, b) => a.name.localeCompare(b.name));
console.log("Flags" ,flag)
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


  const handleCellClick = (medicineId: string, field: EditableField) => {
    setEditingCell(`${medicineId}-${field}`);
  };

  const handleInputChange = (medicineId: string, field: EditableField, value: string) => {
    setPendingChanges(prev => ({
        ...prev,
        [medicineId]: {
            ...prev[medicineId],
            [field]: value,
        },
    }));
  };

  const handleInputBlur = () => {
     setEditingCell(null);
  };

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
          <TableHead>Cat. A</TableHead>
          <TableHead>Cat. B</TableHead>
          <TableHead>Cat. C</TableHead>
          <TableHead>Notes</TableHead>
          <TableHead className="text-right w-[180px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedItems.map((item) => {
          const req = requirements.find(r => r.medicineId === item._id);
          const currentChanges = pendingChanges[item._id];
          
          const getDisplayValue = (field: EditableField) => {
            const changedValue = currentChanges?.[field];
            if (changedValue !== undefined) {
              return changedValue;
            }
            return req?.[field] ?? '-';
          };
          

          return (
            <TableRow key={item._id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.form}</TableCell>
              <TableCell>{item.strength ?? 'N/A'}</TableCell>
              <TableCell>{item.indication}</TableCell>

              {(['categoryA', 'categoryB', 'categoryC'] as EditableField[]).map(field => (
                 <TableCell key={field} onClick={() => handleCellClick(item._id, field)}>
                    {editingCell === `${item._id}-${field}` ? (
                    <Input
                        defaultValue={getDisplayValue(field)}
                        onChange={(e) => handleInputChange(item._id, field, e.target.value)}
                        onBlur={handleInputBlur}
                        autoFocus
                        className="w-24"
                    />
                    ) : (
                    <span>{getDisplayValue(field)}</span>
                    )}
                </TableCell>
              ))}

              <TableCell className="text-xs text-muted-foreground">{item.notes ?? 'N/A'}</TableCell>
              
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                    {currentChanges && (
                      <form action={formAction}>
                          <input type="hidden" name="flag" value={flag} />
                          <input type="hidden" name="medicineId" value={item._id} />
                          <input type="hidden" name="categoryA" value={currentChanges.categoryA ?? req?.categoryA ?? '-'} />
                          <input type="hidden" name="categoryB" value={currentChanges.categoryB ?? req?.categoryB ?? '-'} />
                          <input type="hidden" name="categoryC" value={currentChanges.categoryC ?? req?.categoryC ?? '-'} />
                          <input type="hidden" name="isMedicine" value="true" />
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
      </TableBody>
    </Table>
    </>
  );
}
