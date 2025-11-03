

"use server";

import { z } from "zod";
import { 
    createShip as dbCreateShip, 
    updateFlagRequirement as dbUpdateFlagRequirement, 
    createMedicine as dbCreateMedicine, 
    updateMedicine as dbUpdateMedicine, 
    deleteMedicine as dbDeleteMedicine, 
    createCompany as dbCreateCompany,
    updateCompany as dbUpdateCompany, 
    getShipById,
    getInventoryForShip,
    addBatch as dbAddBatch, 
    updateBatch as dbUpdateBatch, 
    deleteBatch as dbDeleteBatch,
    getShipIdFromBatch,
    getShipIdFromInventoryItem,
    createMedicalLog as dbCreateMedicalLog,
    getBatchById,
    getMedicalLogsForShip as dbGetMedicalLogsForShip,
    getInventoryItemById,
    addNonMandatoryItem as dbAddNonMandatoryItem,
    createNonMedicalConsumptionLog as dbCreateNonMedicalConsumptionLog,
    updatePharmacistDetails as dbUpdatePharmacistDetails,
    createSupplyLog as dbCreateSupplyLog,
    addItemsToSupplyLog as dbAddItemsToSupplyLog,
} from "./data";
import { revalidatePath } from "next/cache";
import * as xlsx from 'xlsx';
import { format } from "date-fns";
import { NonMedicalConsumptionReasons, SupplyLogStatuses } from "@/types";
import { medicalGuidanceFlow } from "@/ai/flows/medical-guidance-flow";

const CompanySchema = z.object({
  name: z.string().min(3, "Company name must be at least 3 characters long."),
  address: z.string().min(10, "Address must be at least 10 characters long."),
  phone: z.string().min(10, "Phone number must be at least 10 characters long."),
  picName: z.string().min(3, "PIC name is required."),
  picEmail: z.string().email("Invalid email for PIC."),
  picPhone: z.string().min(10, "PIC phone number is required."),
  picPhone2: z.string().optional(),
  doctorName: z.string().min(3, "Doctor name is required."),
  doctorEmail: z.string().email("Invalid email for Doctor."),
  doctorPhone: z.string().min(10, "Doctor phone number is required."),
  doctorPhone2: z.string().optional(),
  medicalLogFormNumber: z.string().optional(),
});

const UpdateCompanySchema = CompanySchema.extend({
    id: z.string().min(1),
});

const ShipSchema = z.object({
  name: z.string().min(3, "Ship name must be at least 3 characters long."),
  imo: z.string().length(7, "IMO number must be 7 characters."),
  flag: z.enum(["Panama", "Liberia", "Marshall Islands", "Hong Kong", "Singapore", "India", "Cayman Islands"], {
    errorMap: () => ({ message: "Please select a valid flag." }),
  }),
  crewCount: z.coerce.number().int().positive("Crew count must be a positive number."),
  companyId: z.string().min(1, "Please select a company."),
  category: z.enum(['A', 'B', 'C'], {
    errorMap: () => ({ message: "Please select a vessel category." }),
  }),
});

export async function createShipAction(prevState: any, formData: FormData) {
  const validatedFields = ShipSchema.safeParse({
    name: formData.get("name"),
    imo: formData.get("imo"),
    flag: formData.get("flag"),
    crewCount: formData.get("crewCount"),
    companyId: formData.get("companyId"),
    category: formData.get("category"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Failed to create ship. Please check the fields.",
    };
  }

  try {
    await dbCreateShip(validatedFields.data);
    revalidatePath("/");
    return { message: `Successfully created ship ${validatedFields.data.name}.`, errors: null };
  } catch (error) {
    return { message: "Database Error: Failed to create ship.", errors: { db: "Failed to create ship" } };
  }
}

export async function createCompanyAction(prevState: any, formData: FormData) {
  const validatedFields = CompanySchema.safeParse({
    name: formData.get("name"),
    address: formData.get("address"),
    phone: formData.get("phone"),
    picName: formData.get("picName"),
    picEmail: formData.get("picEmail"),
    picPhone: formData.get("picPhone"),
    picPhone2: formData.get("picPhone2"),
    doctorName: formData.get("doctorName"),
    doctorEmail: formData.get("doctorEmail"),
    doctorPhone: formData.get("doctorPhone"),
    doctorPhone2: formData.get("doctorPhone2"),
    medicalLogFormNumber: formData.get("medicalLogFormNumber"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Failed to create company. Please check the fields.",
    };
  }
  
  const { name, address, phone, picName, picEmail, picPhone, picPhone2, doctorName, doctorEmail, doctorPhone, doctorPhone2, medicalLogFormNumber } = validatedFields.data;

  try {
    await dbCreateCompany({
        name,
        address,
        phone,
        pic: { name: picName, email: picEmail, phone: picPhone, phone2: picPhone2 },
        doctor: { name: doctorName, email: doctorEmail, phone: doctorPhone, phone2: doctorPhone2 },
        medicalLogFormNumber
    });
    revalidatePath("/");
    return { message: `Successfully created company ${name}.`, errors: null };
  } catch (error: any) {
    if (error.message.includes("already exists")) {
        return { message: error.message, errors: { name: "Company already exists" } };
    }
    return { message: "Database Error: Failed to create company.", errors: { db: "Failed to create company" } };
  }
}


export async function updateCompanyAction(prevState: any, formData: FormData) {
    const validatedFields = UpdateCompanySchema.safeParse({
        id: formData.get("id"),
        name: formData.get("name"),
        address: formData.get("address"),
        phone: formData.get("phone"),
        picName: formData.get("picName"),
        picEmail: formData.get("picEmail"),
        picPhone: formData.get("picPhone"),
        picPhone2: formData.get("picPhone2"),
        doctorName: formData.get("doctorName"),
        doctorEmail: formData.get("doctorEmail"),
        doctorPhone: formData.get("doctorPhone"),
        doctorPhone2: formData.get("doctorPhone2"),
        medicalLogFormNumber: formData.get("medicalLogFormNumber"),
    });

    if (!validatedFields.success) {
        return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Failed to update company. Please check the fields.",
        };
    }

    const { id, name, address, phone, picName, picEmail, picPhone, picPhone2, doctorName, doctorEmail, doctorPhone, doctorPhone2, medicalLogFormNumber } = validatedFields.data;

    try {
        await dbUpdateCompany(id, {
            name,
            address,
            phone,
            pic: { name: picName, email: picEmail, phone: picPhone, phone2: picPhone2 },
            doctor: { name: doctorName, email: doctorEmail, phone: doctorPhone, phone2: doctorPhone2 },
            medicalLogFormNumber
        });
        revalidatePath("/");
        return { message: `Successfully updated company ${name}.`, errors: null };
    } catch (error) {
        return { message: "Database Error: Failed to update company.", errors: { db: "Failed to update" } };
    }
}


const AddBatchSchema = z.object({
  inventoryItemId: z.string(),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1."),
  batchNumber: z.string().optional().nullable(),
  expiryDate: z.date().optional().nullable(),
  manufacturerName: z.string().optional().nullable(),
});

export async function addBatchAction(prevState: any, formData: FormData) {
    const expiryDateValue = formData.get("expiryDate");
    const validatedFields = AddBatchSchema.safeParse({
        inventoryItemId: formData.get("inventoryItemId"),
        quantity: formData.get("quantity"),
        batchNumber: formData.get("batchNumber"),
        expiryDate: expiryDateValue ? new Date(expiryDateValue.toString()) : null,
        manufacturerName: formData.get("manufacturerName"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Failed to add batch. Invalid data.",
        };
    }
    
    const { inventoryItemId, ...newBatchData } = validatedFields.data;

    try {
        const shipId = await getShipIdFromInventoryItem(inventoryItemId);
        await dbAddBatch(inventoryItemId, newBatchData);
        if (shipId) {
            revalidatePath(`/ships/${shipId}`);
        }
        revalidatePath('/');

        return { message: "Successfully added batch.", errors: null };
    } catch (error) {
        return { message: "Database Error: Failed to add batch.", errors: { db: "Failed to add batch" } };
    }
}


const UpdateBatchSchema = z.object({
  batchId: z.string(),
  quantity: z.coerce.number().int().min(0, "Quantity cannot be negative."),
  batchNumber: z.string().optional().nullable(),
  expiryDate: z.date().optional().nullable(),
  manufacturerName: z.string().optional().nullable(),
});


export async function updateBatchAction(prevState: any, formData: FormData) {
    const expiryDateValue = formData.get("expiryDate");
    const validatedFields = UpdateBatchSchema.safeParse({
        batchId: formData.get("batchId"),
        quantity: formData.get("quantity"),
        batchNumber: formData.get("batchNumber"),
        expiryDate: expiryDateValue ? new Date(expiryDateValue.toString()) : null,
        manufacturerName: formData.get("manufacturerName"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Failed to update batch. Invalid data.",
        };
    }

    const { batchId, ...updates } = validatedFields.data;

    try {
        const shipId = await getShipIdFromBatch(batchId);
        await dbUpdateBatch(batchId, updates);
        if (shipId) {
           revalidatePath(`/ships/${shipId}`);
        }
        revalidatePath('/');
        return { message: "Successfully updated batch.", errors: null };
    } catch (error) {
        return { message: "Database Error: Failed to update batch.", errors: { db: "Failed to update" } };
    }
}


export async function deleteBatchAction(prevState: any, formData: FormData) {
    const batchId = formData.get("batchId") as string;
    const shipId = await getShipIdFromBatch(batchId);
     if (!batchId || !shipId) {
        return { message: "Missing required IDs.", errors: { id: "ID is missing" } };
    }
    try {
        await dbDeleteBatch(batchId);
        revalidatePath(`/ships/${shipId}`);
        revalidatePath('/');
        return { message: "Batch deleted successfully.", errors: null };
    } catch (error) {
        return { message: "Database Error: Failed to delete batch.", errors: { db: "Failed to delete" } };
    }
}


export async function exportInventoryToExcel(shipId: string) {
  try {
    const ship = await getShipById(shipId);
    if (!ship) {
      throw new Error('Ship not found');
    }
    const inventory = await getInventoryForShip(shipId);

    const dataToExport = inventory.flatMap(item => 
        item.batches.length > 0 ?
        item.batches.map(batch => ({
            'Medicine/Equipment': item.medicineName,
            'Onboard Quantity': item.totalQuantity,
            'Required Quantity': item.requiredQuantity,
            'Status': item.totalQuantity < item.requiredQuantity ? 'Low Stock' : 'Sufficient',
            'Batch Number': batch.batchNumber || 'N/A',
            'Batch Quantity': batch.quantity,
            'Expiry Date': batch.expiryDate ? new Date(batch.expiryDate).toLocaleDateString() : 'N/A',
        })) : [{
            'Medicine/Equipment': item.medicineName,
            'Onboard Quantity': item.totalQuantity,
            'Required Quantity': item.requiredQuantity,
            'Status': item.totalQuantity < item.requiredQuantity ? 'Low Stock' : 'Sufficient',
            'Batch Number': 'N/A',
            'Batch Quantity': 0,
            'Expiry Date': 'N/A',
        }]
    );

    const worksheet = xlsx.utils.json_to_sheet(dataToExport);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, `${ship.name} Inventory`);
    
    // Set column widths
    const colWidths = [
      { wch: 30 }, // Medicine/Equipment
      { wch: 15 }, // Onboard Quantity
      { wch: 15 }, // Required Quantity
      { wch: 15 }, // Status
      { wch: 20 }, // Batch Number
      { wch: 15 }, // Batch Quantity
      { wch: 15 }, // Expiry Date
    ];
    worksheet['!cols'] = colWidths;
    
    const buffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    const dataUrl = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${buffer.toString('base64')}`;
    
    return { 
        success: true, 
        dataUrl,
        filename: `${ship.name.replace(/\s+/g, '_')}_Inventory_${new Date().toISOString().split('T')[0]}.xlsx`
    };

  } catch (error) {
    console.error("Failed to export inventory:", error);
    return { success: false, message: "Failed to export inventory." };
  }
}

const UpdateFlagRequirementSchema = z.object({
  flag: z.enum(["Panama", "Liberia", "Marshall Islands", "Hong Kong", "Singapore", "India", "Cayman Islands"]),
  medicineId: z.string(),
  isMedicine: z.string().optional(),
  quantity: z.string().optional(),
  categoryA: z.string().optional(),
  categoryB: z.string().optional(),
  categoryC: z.string().optional(),
});

export async function updateFlagRequirementAction(prevState: any, formData: FormData) {
    const validatedFields = UpdateFlagRequirementSchema.safeParse({
        flag: formData.get("flag"),
        medicineId: formData.get("medicineId"),
        isMedicine: formData.get("isMedicine"),
        quantity: formData.get("quantity"),
        categoryA: formData.get("categoryA"),
        categoryB: formData.get("categoryB"),
        categoryC: formData.get("categoryC"),
    });

    if (!validatedFields.success) {
        return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Invalid data provided.",
        };
    }

    try {
        const { flag, medicineId, ...updates } = validatedFields.data;
        await dbUpdateFlagRequirement(flag, medicineId, updates);
        revalidatePath("/");
        return { message: "Requirement updated successfully.", data: validatedFields.data, errors: null };
    } catch (error) {
        return { message: "Failed to update requirement.", errors: { db: "Failed to update" } };
    }
}


const MedicineSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Item name must be at least 3 characters long."),
  type: z.enum(['Medicine', 'Equipment']),
  category: z.string().optional().nullable(),
  form: z.string().min(2, "Form must be at least 2 characters long."),
  strength: z.string().optional(),
  indication: z.string().min(3, "Indication must be at least 3 characters long."),
  notes: z.string().optional(),
  categoryA: z.string().optional(),
  categoryB: z.string().optional(),
  categoryC: z.string().optional(),
  quantity: z.string().optional(),
});


export async function createMedicineAction(prevState: any, formData: FormData) {
    const validatedFields = MedicineSchema.safeParse({
        name: formData.get("name"),
        type: formData.get("type"),
        category: formData.get("category"),
        form: formData.get("form"),
        strength: formData.get("strength"),
        indication: formData.get("indication"),
        notes: formData.get("notes"),
        categoryA: formData.get("categoryA"),
        categoryB: formData.get("categoryB"),
        categoryC: formData.get("categoryC"),
        quantity: formData.get("quantity"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Failed to create item. Please check the fields.",
        };
    }

    const { name, type, category, form, strength, indication, notes, categoryA, categoryB, categoryC, quantity } = validatedFields.data;

    try {
        await dbCreateMedicine({
            name,
            type,
            category,
            form,
            strength: strength || null,
            indication,
            notes: notes || null,
            categoryA,
            categoryB,
            categoryC,
            quantity
        });
        revalidatePath("/");
        return { message: `Successfully created item: ${validatedFields.data.name}.`, errors: null };
    } catch (error: any) {
         if (error.message.includes("already exists")) {
            return { message: `Error: An item with the name "${validatedFields.data.name}" already exists.`, errors: { name: "Item already exists" } };
        }
        return { message: "Database Error: Failed to create item.", errors: { db: "Failed to create item" } };
    }
}

export async function updateMedicineAction(prevState: any, formData: FormData) {
    const validatedFields = MedicineSchema.safeParse({
        id: formData.get("id"),
        name: formData.get("name"),
        type: formData.get("type"),
        category: formData.get("category"),
        form: formData.get("form"),
        strength: formData.get("strength"),
        indication: formData.get("indication"),
        notes: formData.get("notes"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Failed to update item. Please check the fields.",
        };
    }

    if (!validatedFields.data.id) {
        return { errors: { id: "ID is missing" }, message: "Failed to update item." };
    }

    const { id, ...updates } = validatedFields.data;

    try {
        await dbUpdateMedicine(id, {
            ...updates,
            strength: validatedFields.data.strength || null,
            notes: validatedFields.data.notes || null,
        });
        revalidatePath("/");
        revalidatePath(`/ships/${id}`); // Also revalidate individual ship pages if needed.
        return { message: `Successfully updated item: ${validatedFields.data.name}.`, errors: null };
    } catch (error: any) {
        if (error.message.includes("already exists")) {
            return { message: `Error: An item with the name "${updates.name}" already exists.`, errors: { name: "Item already exists" } };
        }
        return { message: "Database Error: Failed to update item.", errors: { db: "Failed to update item" } };
    }
}

export async function deleteMedicineAction(prevState: any, formData: FormData) {
    const id = formData.get("id") as string;

    if (!id) {
        return { message: "Item ID not found.", errors: { id: "ID is missing" } };
    }

    try {
        await dbDeleteMedicine(id);
        revalidatePath("/");
        return { message: "Item deleted successfully.", errors: null };
    } catch (error) {
        return { message: "Database Error: Failed to delete item.", errors: { db: "Failed to delete" } };
    }
}


const MedicalLogSchema = z.object({
  shipId: z.string(),
  date: z.date(),
  crewMemberName: z.string().min(1, "Crew member name is required."),
  rank: z.string().min(1, "Rank is required."),
  caseDescription: z.string().min(1, "Case description is required."),
  medicineUsedId: z.string().min(1, "Medicine must be selected."),
  batchUsedId: z.string().min(1, "Batch must be selected."),
  quantityUsed: z.coerce.number().int().positive("Quantity must be greater than 0."),
  notes: z.string().optional().nullable(),
  photoUrl: z.string().optional().nullable(),
});


export async function createMedicalLogAction(prevState: any, formData: FormData) {
    const dateValue = formData.get("date");
    const validatedFields = MedicalLogSchema.safeParse({
        shipId: formData.get("shipId"),
        date: dateValue ? new Date(dateValue.toString()) : new Date(),
        crewMemberName: formData.get("crewMemberName"),
        rank: formData.get("rank"),
        caseDescription: formData.get("caseDescription"),
        medicineUsedId: formData.get("medicineUsedId"),
        batchUsedId: formData.get("batchUsedId"),
        quantityUsed: formData.get("quantityUsed"),
        notes: formData.get("notes"),
        photoUrl: formData.get("photoUrl"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Failed to create medical log entry. Please check the fields.",
        };
    }

    const { shipId, batchUsedId, quantityUsed } = validatedFields.data;

    try {
        // Step 1: Update inventory if a medicine was used
        if (batchUsedId && quantityUsed) {
            const batch = await getBatchById(batchUsedId);
            if (!batch) {
                return { message: "Batch not found.", errors: { batchUsedId: "Invalid batch selected." } };
            }
            if (batch.quantity < quantityUsed) {
                return { message: `Not enough quantity in batch. Available: ${batch.quantity}`, errors: { quantityUsed: "Quantity exceeds available stock." } };
            }
            
            const newQuantity = batch.quantity - quantityUsed;
            await dbUpdateBatch(batchUsedId, { quantity: newQuantity });
        }

        // Step 2: Create the medical log entry
        await dbCreateMedicalLog(validatedFields.data);

        // Step 3: Revalidate path to show updated data
        revalidatePath(`/ships/${shipId}`);
        return { message: "Successfully created medical log entry.", errors: null };
    } catch (error: any) {
        return { message: `Database Error: ${error.message}`, errors: { db: "Failed to create entry" } };
    }
}

export async function exportMedicalLogToExcel(shipId: string, startDate?: Date, endDate?: Date) {
    try {
        const ship = await getShipById(shipId);
        if (!ship) {
            throw new Error('Ship not found');
        }
        
        let logs = await dbGetMedicalLogsForShip(shipId);

        // Filter by date if provided
        if (startDate && endDate) {
            logs = logs.filter(log => {
                const logDate = new Date(log.date);
                return logDate >= startDate && logDate <= endDate;
            });
        }
        
        const inventory = await getInventoryForShip(shipId);

        const getMedicineName = (medicineId: string | null | undefined) => {
            if (!medicineId) return 'N/A';
            const inventoryItem = inventory.find(item => item.id === medicineId || item.medicineId === medicineId);
            return inventoryItem?.medicineName || 'Unknown';
        };

        const dataToExport = logs.map(log => ({
            'Date': format(new Date(log.date), 'PPP'),
            'Crew Member': log.crewMemberName,
            'Rank': log.rank,
            'Case Description': log.caseDescription,
            'Medicine Provided': getMedicineName(log.medicineUsedId),
            'Qty Used': log.quantityUsed,
            'Batch #': log.batchNumber || 'N/A',
            'Expiry Date': log.expiryDate ? format(new Date(log.expiryDate), 'PPP') : 'N/A',
            'Notes': log.notes || 'N/A'
        }));

        const worksheet = xlsx.utils.json_to_sheet(dataToExport);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, `Medical Log`);
        
        // Set column widths
        const colWidths = [
            { wch: 15 }, // Date
            { wch: 20 }, // Crew Member
            { wch: 15 }, // Rank
            { wch: 40 }, // Case Description
            { wch: 30 }, // Medicine Provided
            { wch: 10 }, // Qty Used
            { wch: 15 }, // Batch #
            { wch: 15 }, // Expiry Date
            { wch: 40 }, // Notes
        ];
        worksheet['!cols'] = colWidths;
        
        const buffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });
        const dataUrl = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${buffer.toString('base64')}`;
        
        return { 
            success: true, 
            dataUrl,
            filename: `${ship.name.replace(/\s+/g, '_')}_MedicalLog_${new Date().toISOString().split('T')[0]}.xlsx`
        };

    } catch (error) {
        console.error("Failed to export medical log:", error);
        return { success: false, message: "Failed to export medical log." };
    }
}


const AddNonMandatorySchema = z.object({
  shipId: z.string(),
  isNewMedicine: z.boolean().default(false),
  medicineId: z.string().optional(),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1."),
  batchNumber: z.string().optional().nullable(),
  expiryDate: z.date().optional().nullable(),
  // New medicine fields
  name: z.string().optional(),
  form: z.string().optional(),
  strength: z.string().optional(),
  indication: z.string().optional(),
  notes: z.string().optional(),
}).refine(data => {
    if (data.isNewMedicine) {
        return data.name && data.name.length >= 3 && data.form && data.form.length >= 2 && data.indication && data.indication.length >= 3;
    }
    return !!data.medicineId;
}, {
    message: "Either select an existing medicine or provide all required details for a new one.",
    path: ["medicineId"],
});


export async function addNonMandatoryItemAction(prevState: any, formData: FormData) {
    const expiryDateValue = formData.get("expiryDate");
    const validatedFields = AddNonMandatorySchema.safeParse({
        shipId: formData.get("shipId"),
        isNewMedicine: formData.get("isNewMedicine") === "on",
        medicineId: formData.get("medicineId"),
        quantity: formData.get("quantity"),
        batchNumber: formData.get("batchNumber"),
        expiryDate: expiryDateValue ? new Date(expiryDateValue.toString()) : null,
        name: formData.get("name"),
        form: formData.get("form"),
        strength: formData.get("strength"),
        indication: formData.get("indication"),
        notes: formData.get("notes"),
    });

    if (!validatedFields.success) {
        console.log(validatedFields.error.flatten());
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Failed to add item. Invalid data.",
        };
    }
    
    const { shipId, quantity, batchNumber, expiryDate } = validatedFields.data;
    const batchData = { quantity, batchNumber, expiryDate };

    try {
        let medicineIdToUse = validatedFields.data.medicineId;

        if (validatedFields.data.isNewMedicine) {
            const { name, form, strength, indication, notes } = validatedFields.data;
             if (!name || !form || !indication) {
                return { message: "New medicine details are incomplete.", errors: { name: "Name is required" } };
            }
            const newMedicine = await dbCreateMedicine({
                name,
                type: 'Medicine',
                form,
                strength: strength || null,
                indication,
                notes: notes || null,
            });
            medicineIdToUse = newMedicine.id;
        }

        if (!medicineIdToUse) {
             return { message: "Medicine could not be identified or created.", errors: { medicineId: "No medicine selected or created." } };
        }

        await dbAddNonMandatoryItem(shipId, medicineIdToUse, batchData);
        revalidatePath(`/ships/${shipId}`);
        revalidatePath('/');
        return { message: "Successfully added item.", errors: null };
    } catch (error: any) {
         if (error.message.includes("already exists")) {
            return { message: error.message, errors: { name: "An item with this name already exists." } };
        }
        return { message: `Database Error: ${error.message}`, errors: { db: "Failed to add item" } };
    }
}


const NonMedicalConsumptionLogSchema = z.object({
  shipId: z.string(),
  date: z.date(),
  medicineId: z.string().min(1, "Medicine must be selected."),
  batchId: z.string().min(1, "Batch must be selected."),
  quantity: z.coerce.number().int().positive("Quantity must be greater than 0."),
  reason: z.enum(NonMedicalConsumptionReasons),
  notes: z.string().optional().nullable(),
});

export async function createNonMedicalConsumptionLogAction(prevState: any, formData: FormData) {
    const dateValue = formData.get("date");
    const validatedFields = NonMedicalConsumptionLogSchema.safeParse({
        shipId: formData.get("shipId"),
        date: dateValue ? new Date(dateValue.toString()) : new Date(),
        medicineId: formData.get("medicineId"),
        batchId: formData.get("batchId"),
        quantity: formData.get("quantity"),
        reason: formData.get("reason"),
        notes: formData.get("notes"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Failed to create log entry. Please check the fields.",
        };
    }

    const { shipId, batchId, quantity } = validatedFields.data;

    try {
        const batch = await getBatchById(batchId);
        if (!batch) {
            return { message: "Batch not found.", errors: { batchId: "Invalid batch selected." } };
        }
        if (batch.quantity < quantity) {
            return { message: `Not enough quantity in batch. Available: ${batch.quantity}`, errors: { quantity: "Quantity exceeds available stock." } };
        }
        
        const newQuantity = batch.quantity - quantity;
        await dbUpdateBatch(batchId, { quantity: newQuantity });
        await dbCreateNonMedicalConsumptionLog(validatedFields.data);

        revalidatePath(`/ships/${shipId}`);
        return { message: "Successfully created consumption log entry.", errors: null };
    } catch (error: any) {
        return { message: `Database Error: ${error.message}`, errors: { db: "Failed to create entry" } };
    }
}

export async function askAIAssistant(prevState: any, formData: FormData) {
  const query = formData.get('query') as string;
  if (!query) {
    return { role: 'assistant', error: 'Query cannot be empty.' };
  }

  try {
    const result = await medicalGuidanceFlow({ query });
    return { role: 'assistant', content: result.answer };
  } catch (e: any) {
    console.error(e);
    return { role: 'assistant', error: 'An error occurred while contacting the AI.' };
  }
}

const PharmacistDetailsSchema = z.object({
    name: z.string().min(3, "Pharmacist name is required."),
    licenseNumber: z.string().min(3, "License number is required."),
    signature: z.string().min(1, "Signature text is required."),
    supplierName: z.string().min(3, "Supplier name is required."),
    supplierAddress: z.string().min(10, "Supplier address is required."),
    supplierStateLicense: z.string().min(1, "State license is required."),
    supplierTel: z.string().min(8, "Supplier telephone is required."),
});

export async function updatePharmacistDetailsAction(prevState: any, formData: FormData) {
    const validatedFields = PharmacistDetailsSchema.safeParse({
        name: formData.get("name"),
        licenseNumber: formData.get("licenseNumber"),
        signature: formData.get("signature"),
        supplierName: formData.get("supplierName"),
        supplierAddress: formData.get("supplierAddress"),
        supplierStateLicense: formData.get("supplierStateLicense"),
        supplierTel: formData.get("supplierTel"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Failed to update details. Please check the fields.",
        };
    }
    
    const { name, licenseNumber, signature, supplierName, supplierAddress, supplierStateLicense, supplierTel } = validatedFields.data;

    try {
        await dbUpdatePharmacistDetails({
            name,
            licenseNumber,
            signature,
            supplier: {
                name: supplierName,
                address: supplierAddress,
                stateLicense: supplierStateLicense,
                tel: supplierTel,
            }
        });
        revalidatePath("/dashboard/settings");
        revalidatePath("/certificate");
        return { message: "Successfully updated pharmacist details.", errors: null };
    } catch (error) {
        return { message: "Error: Failed to update details.", errors: { db: "Failed to save" } };
    }
}


const SupplyLogSchema = z.object({
  shipId: z.string(),
  date: z.date(),
  portOfSupply: z.string().min(1, "Port of supply is required."),
  supplierName: z.string().min(1, "Supplier name is required."),
  trackingNumber: z.string().optional().nullable(),
  status: z.enum(SupplyLogStatuses),
  notes: z.string().optional().nullable(),
  orderListUrl: z.string().optional().nullable(),
  orderListFilename: z.string().optional().nullable(),
});

export async function createSupplyLogAction(prevState: any, formData: FormData) {
    const dateValue = formData.get("date");
    const validatedFields = SupplyLogSchema.safeParse({
        shipId: formData.get("shipId"),
        date: dateValue ? new Date(dateValue.toString()) : new Date(),
        portOfSupply: formData.get("portOfSupply"),
        supplierName: formData.get("supplierName"),
        trackingNumber: formData.get("trackingNumber"),
        status: formData.get("status"),
        notes: formData.get("notes"),
        orderListUrl: formData.get("orderListUrl"),
        orderListFilename: formData.get("orderListFilename"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Failed to create supply log entry. Please check the fields.",
        };
    }

    try {
        await dbCreateSupplyLog(validatedFields.data);
        revalidatePath(`/ships/${validatedFields.data.shipId}`);
        return { message: "Successfully recorded supply.", errors: null };
    } catch (error: any) {
        return { message: `Database Error: ${error.message}`, errors: { db: "Failed to create entry" } };
    }
}

const AddItemsToSupplyLogSchema = z.object({
  shipId: z.string(),
  supplyLogId: z.string(),
  medicineId: z.string().min(1, "An item must be selected."),
  manufacturerName: z.string().optional().nullable(),
  batchNumber: z.string().optional().nullable(),
  expiryDate: z.date().optional().nullable(),
  quantity: z.coerce.number().int().positive("Quantity must be a positive number."),
});

export async function addItemsToSupplyLogAction(prevState: any, formData: FormData) {
    const expiryDateValue = formData.get("expiryDate");
    const validatedFields = AddItemsToSupplyLogSchema.safeParse({
        shipId: formData.get("shipId"),
        supplyLogId: formData.get("supplyLogId"),
        medicineId: formData.get("medicineId"),
        manufacturerName: formData.get("manufacturerName"),
        batchNumber: formData.get("batchNumber"),
        expiryDate: expiryDateValue ? new Date(expiryDateValue.toString()) : null,
        quantity: formData.get("quantity"),
    });

     if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Failed to add item. Please check the fields.",
        };
    }

    const { shipId, supplyLogId, ...itemData } = validatedFields.data;

    try {
        await dbAddItemsToSupplyLog(supplyLogId, [itemData]);
        revalidatePath(`/ships/${shipId}`);
        return { message: "Successfully added item to supply log and updated inventory.", errors: null };
    } catch (error: any) {
        return { message: `Database Error: ${error.message}`, errors: { db: "Failed to add item" } };
    }
}
