

'use server';

import type { Ship, Medicine, Flag, InventoryItem, FlagRequirement, Company, VesselCategory, Batch, MedicalLog, NonMedicalConsumptionLog, SupplyLog, SuppliedItem } from '@/types';
import type { PharmacistDetails } from './certificate-data';
import { add, sub, set } from 'date-fns';
import { promises as fs } from 'fs';
import path from 'path';



// --- API Functions ---
export async function getCompanies(): Promise<Company[]> {
    return companies;
}

export async function getCompanyById(id: string): Promise<Company | undefined> {
    return companies.find(c => c.id === id);
}

export async function getShips(): Promise<Ship[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return ships;
}

export async function getMedicalLogsForShip(shipId: string): Promise<MedicalLog[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const logs = medicalLogs.filter(log => log.shipId === shipId);

    const detailedLogs = await Promise.all(logs.map(async log => {
        const batch = await getBatchById(log.batchUsedId);
        return {
            ...log,
            batchNumber: batch?.batchNumber,
            expiryDate: batch?.expiryDate
        };
    }));
    
    return detailedLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getNonMedicalConsumptionLogsForShip(shipId: string): Promise<NonMedicalConsumptionLog[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const logs = nonMedicalConsumptionLogs.filter(log => log.shipId === shipId);
    
    const detailedLogs = await Promise.all(logs.map(async log => {
        const medicine = await getMedicines().then(meds => meds.find(m => m.id === log.medicineId));
        const batch = await getBatchById(log.batchId);
        return {
            ...log,
            medicineName: medicine?.name || 'Unknown',
            batchNumber: batch?.batchNumber || 'N/A'
        };
    }));

    return detailedLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getSupplyLogsForShip(shipId: string): Promise<SupplyLog[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return supplyLogs.filter(log => log.shipId === shipId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}


export async function getInventoryForShip(shipId: string): Promise<InventoryItem[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const currentShip = await getShipById(shipId);
    if (!currentShip) {
        throw new Error('Ship not found');
    }

    const flagReqs = flagRequirements[currentShip.flag] || [];
    const masterMedicineList = await getMedicines();

    // Ensure every item in master list is in inventory, even if empty
    const shipInv = shipInventory[shipId] || [];
    
    const detailedInventory: InventoryItem[] = masterMedicineList.map(med => {
        const existingItem = shipInv.find(i => i.medicineId === med.id);
        const requirement = flagReqs.find(req => req.medicineId === med.id);

        let requiredQuantity = 0;
        if (requirement) {
            let baseQtyStr: string | undefined;
            if (med.type === 'Medicine') {
                const catKey = `category${currentShip.category}` as keyof Omit<FlagRequirement, 'medicineId'>;
                baseQtyStr = requirement[catKey];
            } else { // Equipment
                baseQtyStr = requirement.quantity;
            }

            if (baseQtyStr && baseQtyStr !== '-') {
                const baseQty = parseInt(baseQtyStr.replace(/[^0-9]/g, ''), 10) || 0;
                
                if (med.type === 'Medicine') {
                    // Rule: quantity is per 10 crew, rounded up.
                    const crewMultiplier = Math.ceil(currentShip.crewCount / 10);
                    requiredQuantity = baseQty * crewMultiplier;
                } else {
                    requiredQuantity = baseQty;
                }
                
                if (med.notes?.includes('double if crew size > 30') && currentShip.crewCount > 30) {
                    requiredQuantity *= 2;
                }
                 if (med.notes?.includes('per patient')) {
                    requiredQuantity *= currentShip.crewCount;
                }
            }
        }

        if (existingItem) {
            return {
                ...existingItem,
                medicineName: med.name,
                medicineCategory: med.category || 'Uncategorized',
                type: med.type,
                requiredQuantity: requiredQuantity,
                totalQuantity: existingItem.batches.reduce((sum, b) => sum + b.quantity, 0),
            };
        } else {
            const newInvItem: InventoryItem = {
                id: `inv${Math.random()}`,
                shipId,
                medicineId: med.id,
                medicineName: med.name,
                medicineCategory: med.category || 'Uncategorized',
                type: med.type,
                requiredQuantity: requiredQuantity,
                totalQuantity: 0,
                batches: [],
            };
            if (!shipInventory[shipId]) {
              shipInventory[shipId] = [];
            }
            shipInventory[shipId].push(newInvItem);
            return newInvItem;
        }
    });

    return detailedInventory;
}


export async function getMedicines(): Promise<Medicine[]> {
    return medicines;
}

export async function getFlagRequirements(): Promise<Record<Flag, FlagRequirement[]>> {
    return flagRequirements;
}

export async function createCompany(newCompanyData: Omit<Company, 'id'>): Promise<Company> {
    if (companies.some(c => c.name.toLowerCase() === newCompanyData.name.toLowerCase())) {
        throw new Error(`A company with the name "${newCompanyData.name}" already exists.`);
    }
    const newCompany: Company = { ...newCompanyData, id: String(companies.length + 1) };
    companies.push(newCompany);
    return newCompany;
}

export async function updateCompany(companyId: string, updates: Partial<Omit<Company, 'id'>>): Promise<Company> {
    const company = companies.find(c => c.id === companyId);
    if (company) {
        Object.assign(company, updates);
        return company;
    }
    throw new Error("Company not found");
}

export async function createMedicalLog(newLogData: Omit<MedicalLog, 'id' | 'batchNumber' | 'expiryDate'>): Promise<MedicalLog> {
    const newLog: MedicalLog = { ...newLogData, id: `log${Math.random()}` };
    medicalLogs.push(newLog);
    return newLog;
}

export async function createNonMedicalConsumptionLog(newLogData: Omit<NonMedicalConsumptionLog, 'id'>): Promise<NonMedicalConsumptionLog> {
    const newLog: NonMedicalConsumptionLog = { ...newLogData, id: `nmc${Math.random()}` };
    nonMedicalConsumptionLogs.push(newLog);
    return newLog;
}

export async function createSupplyLog(newLogData: Omit<SupplyLog, 'id' | 'items'>): Promise<SupplyLog> {
    const newLog: SupplyLog = { ...newLogData, id: `sup${Math.random()}`, items: [] };
    supplyLogs.push(newLog);
    return newLog;
}

export async function addItemsToSupplyLog(supplyLogId: string, items: Omit<SuppliedItem, 'id' | 'supplyLogId' | 'medicineName'>[]): Promise<void> {
    const supplyLog = supplyLogs.find(sl => sl.id === supplyLogId);
    if (!supplyLog) {
        throw new Error("Supply log not found");
    }

    for (const item of items) {
        const medicine = medicines.find(m => m.id === item.medicineId);
        if (!medicine) throw new Error(`Medicine with id ${item.medicineId} not found`);

        const newItem: SuppliedItem = {
            ...item,
            id: `si${Math.random()}`,
            supplyLogId,
            medicineName: medicine.name,
        };
        supplyLog.items.push(newItem);

        // This is the part where we update the main inventory
        let inventoryItem = shipInventory[supplyLog.shipId]?.find(inv => inv.medicineId === item.medicineId);
        
        if (!inventoryItem) {
             const newInvItem: InventoryItem = {
                id: `inv${Math.random()}`,
                shipId: supplyLog.shipId,
                medicineId: item.medicineId,
                medicineName: medicine.name,
                medicineCategory: medicine.category || 'Uncategorized',
                type: medicine.type,
                requiredQuantity: 0, // Recalculated on getInventoryForShip
                totalQuantity: 0,
                batches: [],
            };
            if (!shipInventory[supplyLog.shipId]) {
              shipInventory[supplyLog.shipId] = [];
            }
            shipInventory[supplyLog.shipId].push(newInvItem);
            inventoryItem = newInvItem;
        }

        const newBatch: Batch = {
            id: `batch${Math.random()}`,
            inventoryItemId: inventoryItem.id,
            quantity: item.quantity,
            batchNumber: item.batchNumber,
            expiryDate: item.expiryDate,
            manufacturerName: item.manufacturerName,
        };

        inventoryItem.batches.push(newBatch);
    }
}


export async function getShipById(id: string): Promise<Ship | undefined> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return ships.find(s => s.id === id);
}

export async function createShip(newShipData: Omit<Ship, 'id'>): Promise<Ship> {
    const newSrcmdhip: Ship = { ...newShipData, id: String(ships.length + 1) };
    ships.push(newShip);
    return newShip;
}

export async function addBatch(inventoryItemId: string, newBatchData: Omit<Batch, 'id' | 'inventoryItemId'>): Promise<Batch> {
    const { shipId } = await getShipAndInventoryItem(inventoryItemId);
    const newBatch = { ...newBatchData, id: `batch${Math.random()}`, inventoryItemId };
    const inventoryItem = shipInventory[shipId]?.find(i => i.id === inventoryItemId);
    if (inventoryItem) {
        inventoryItem.batches.push(newBatch);
    }
    return newBatch;
}


export async function updateBatch(batchId: string, updates: Partial<Omit<Batch, 'id' | 'inventoryItemId'>>): Promise<Batch> {
    const { inventoryItem, batch } = await getShipAndInventoryItem(undefined, batchId);

    if (inventoryItem && batch) {
        Object.assign(batch, updates);
        inventoryItem.totalQuantity = inventoryItem.batches.reduce((sum, b) => sum + b.quantity, 0);
        return batch;
    }
    throw new Error("Batch not found");
}


export async function deleteBatch(batchId: string): Promise<void> {
    const { inventoryItem, batchIndex } = await getShipAndInventoryItem(undefined, batchId);
    if (inventoryItem && batchIndex !== -1) {
        inventoryItem.batches.splice(batchIndex, 1);
        inventoryItem.totalQuantity = inventoryItem.batches.reduce((sum, b) => sum + b.quantity, 0);
        return;
    }
    throw new Error("Batch not found for deletion");
}


export async function updateFlagRequirement(flag: Flag, medicineId: string, updates: Partial<FlagRequirement>): Promise<void> {
    const reqs = flagRequirements[flag];
    if (reqs) {
        const req = reqs.find(r => r.medicineId === medicineId);
        if (req) {
            Object.assign(req, updates);
        } else {
             reqs.push({ medicineId, ...updates });
        }
    } else {
        flagRequirements[flag] = [{ medicineId, ...updates }];
    }
}

export async function createMedicine(newMedicineData: Omit<Medicine, 'id'> & { categoryA?: string, categoryB?: string, categoryC?: string, quantity?: string }): Promise<Medicine> {
     if (medicines.some(m => m.name.toLowerCase() === newMedicineData.name.toLowerCase())) {
        throw new Error(`An item with the name "${newMedicineData.name}" already exists.`);
    }
    const newMedicine = { ...newMedicineData, id: `med${Math.random()}` };
    medicines.push(newMedicine);

    // Add requirement for all flags
    for (const flag of Object.keys(flagRequirements) as Flag[]) {
        const newReq: FlagRequirement = { medicineId: newMedicine.id };
        if (newMedicine.type === 'Medicine') {
            newReq.categoryA = newMedicineData.categoryA || '0';
            newReq.categoryB = newMedicineData.categoryB || '0';
            newReq.categoryC = newMedicineData.categoryC || '0';
        } else {
            newReq.quantity = newMedicineData.quantity || '0';
        }
        flagRequirements[flag].push(newReq);
    }
    return newMedicine;
}

export async function updateMedicine(medicineId: string, updates: Partial<Medicine>): Promise<Medicine> {
    if (updates.name && medicines.some(m => m.name.toLowerCase() === updates.name?.toLowerCase() && m.id !== medicineId)) {
       throw new Error(`An item with the name "${updates.name}" already exists.`);
    }
    const medicine = medicines.find(m => m.id === medicineId);
    if (medicine) {
        Object.assign(medicine, updates);
        
        // Also update the name in all ship inventories
        for (const shipId in shipInventory) {
            const inventory = shipInventory[shipId];
            const itemToUpdate = inventory.find(i => i.medicineId === medicineId);
            if (itemToUpdate && updates.name) {
                itemToUpdate.medicineName = updates.name;
            }
        }
        return medicine;
    }
    throw new Error("Medicine not found");
}

export async function deleteMedicine(medicineId: string): Promise<void> {
    const index = medicines.findIndex(m => m.id === medicineId);
    if (index > -1) {
        medicines.splice(index, 1);

        // Remove from flag requirements
        for (const flag of Object.keys(flagRequirements) as Flag[]) {
            flagRequirements[flag] = flagRequirements[flag].filter(r => r.medicineId !== medicineId);
        }

        // Remove from ship inventories
        for (const shipId in shipInventory) {
            shipInventory[shipId] = shipInventory[shipId].filter(i => i.medicineId !== medicineId);
        }
        return;
    }
    throw new Error("Medicine not found for deletion");
}


// --- HELPER FUNCTIONS ---

export async function getShipAndInventoryItem(inventoryItemId?: string, batchId?: string) {
    for (const shipId in shipInventory) {
        const inventory = shipInventory[shipId];
        for (const item of inventory) {
            if (inventoryItemId && item.id === inventoryItemId) {
                return { shipId, inventoryItem: item, batch: undefined, batchIndex: -1 };
            }
            if (batchId) {
                const batchIndex = item.batches.findIndex(b => b.id === batchId);
                if (batchIndex !== -1) {
                    return { shipId, inventoryItem: item, batch: item.batches[batchIndex], batchIndex };
                }
            }
        }
    }
    throw new Error("Item not found");
}

export async function getInventoryItemById(inventoryItemId: string): Promise<InventoryItem | null> {
    for (const shipId in shipInventory) {
        const inventory = shipInventory[shipId];
        const item = inventory.find(i => i.id === inventoryItemId);
        if (item) {
            return item;
        }
    }
    return null;
}


export async function getBatchById(batchId: string): Promise<Batch | null> {
    for (const shipId in shipInventory) {
        const inventory = shipInventory[shipId];
        for (const item of inventory) {
            const batch = item.batches.find(b => b.id === batchId);
            if (batch) {
                return batch;
            }
        }
    }
    return null;
}

export async function getShipIdFromBatch(batchId: string): Promise<string | null> {
    for (const shipId in shipInventory) {
        const inventory = shipInventory[shipId];
        for (const item of inventory) {
             const batchExists = item.batches.some(b => b.id === batchId);
             if (batchExists) {
                 return shipId;
             }
        }
    }
    return null;
}

export async function getShipIdFromInventoryItem(inventoryItemId: string): Promise<string | null> {
     for (const shipId in shipInventory) {
        const inventory = shipInventory[shipId];
        const itemExists = inventory.some(i => i.id === inventoryItemId);
        if (itemExists) {
            return shipId;
        }
    }
    return null;
}

export async function addNonMandatoryItem(shipId: string, medicineId: string, newBatchData: Omit<Batch, 'id' | 'inventoryItemId'>): Promise<void> {
    if (!shipInventory[shipId]) {
        shipInventory[shipId] = [];
    }

    let inventoryItem = shipInventory[shipId].find(item => item.medicineId === medicineId);

    if (!inventoryItem) {
        const medicine = await getMedicines().then(meds => meds.find(m => m.id === medicineId));
        if (!medicine) throw new Error("Medicine not found");
        
        inventoryItem = {
            id: `inv${Math.random()}`,
            shipId,
            medicineId,
            medicineName: medicine.name,
            medicineCategory: medicine.category || 'Uncategorized',
            type: medicine.type,
            requiredQuantity: 0,
            totalQuantity: 0,
            batches: [],
        };
        shipInventory[shipId].push(inventoryItem);
    }
    
    const newBatch = { ...newBatchData, id: `batch${Math.random()}`, inventoryItemId: inventoryItem.id };
    inventoryItem.batches.push(newBatch);
    inventoryItem.totalQuantity = inventoryItem.batches.reduce((sum, b) => sum + b.quantity, 0);
}

export async function updatePharmacistDetails(newDetails: PharmacistDetails): Promise<void> {
    const filePath = path.join(process.cwd(), 'src', 'lib', 'certificate-data.ts');
    const fileContent = `
export interface PharmacistDetails {
    name: string;
    licenseNumber: string;
    signature: string;
    supplier: {
        name: string;
        address: string;
        stateLicense: string;
        tel: string;
    };
}

export const pharmacistDetails: PharmacistDetails = ${JSON.stringify(newDetails, null, 4)};
`;
    await fs.writeFile(filePath, fileContent.trim());
}
    
