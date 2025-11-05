

'use server';

import type { Ship, Medicine, Flag, InventoryItem, FlagRequirement, Company, VesselCategory, Batch, MedicalLog, NonMedicalConsumptionLog, SupplyLog, SuppliedItem } from '@/types';
import type { PharmacistDetails } from './certificate-data';
import { add, sub, set } from 'date-fns';
import { promises as fs } from 'fs';
import path from 'path';

// --- MOCKED DATA ---

let companies: Company[] = [
    { 
        id: '1', 
        name: 'Global Maritime Group', 
        address: '123 Ocean Ave, Maritime City, 12345',
        phone: '+1-234-567-8901',
        pic: { name: 'John Admin', email: 'admin@globalmaritime.com', phone: '+1-234-567-8902', phone2: '+1-234-567-8904' },
        doctor: { name: 'Dr. Smith', email: 'doctor@globalmaritime.com', phone: '+1-234-567-8903', phone2: '+1-234-567-8905' },
        medicalLogFormNumber: 'GMG-ML-001'
    },
    { 
        id: '2', 
        name: 'Oceanic Shipping Co.',
        address: '456 Sea Lane, Port Town, 67890',
        phone: '+1-987-654-3210',
        pic: { name: 'Jane Operator', email: 'ops@oceanicshipping.com', phone: '+1-987-654-3211' },
        doctor: { name: 'Dr. Jones', email: 'medic@oceanicshipping.com', phone: '+1-987-654-3212' },
        medicalLogFormNumber: 'OSC-FORM-MED-A'
    },
];

let ships: Ship[] = [
  { id: '1', name: 'The Sea Explorer', imo: '9876543', flag: 'Panama', crewCount: 25, companyId: '1', category: 'A' },
  { id: '2', name: 'The Ocean Voyager', imo: '1234567', flag: 'Liberia', crewCount: 35, companyId: '1', category: 'B' },
  { id: '3', name: 'The Pacific Drifter', imo: '7654321', flag: 'Marshall Islands', crewCount: 18, companyId: '2', category: 'C' },
];

const staticDate = new Date('2024-06-20T10:00:00Z');

let medicalLogs: MedicalLog[] = [
    { id: 'log1', shipId: '1', date: new Date('2024-06-05T10:00:00Z'), crewMemberName: 'John Doe', rank: 'Deck Cadet', caseDescription: 'Cut on hand', notes: 'Minor injury during routine maintenance.', medicineUsedId: 'inv1', batchUsedId: 'batch2', quantityUsed: 1, photoUrl: 'https://picsum.photos/seed/medlog1/600/400' },
    { id: 'log2', shipId: '1', date: new Date('2024-05-20T10:00:00Z'), crewMemberName: 'Jane Smith', rank: 'Chief Mate', caseDescription: 'Seasickness', notes: 'Resolved within 24 hours.', medicineUsedId: 'med39', quantityUsed: 2, batchUsedId: 'batch_placeholder', photoUrl: null },
];

let nonMedicalConsumptionLogs: NonMedicalConsumptionLog[] = [
    { id: 'nmc1', shipId: '1', date: new Date('2024-06-15T10:00:00Z'), medicineId: 'med2', batchId: 'batch3', quantity: 10, reason: 'Damaged', notes: 'Water damage in storage.'}
];

let supplyLogs: SupplyLog[] = [
    { id: 'sup1', shipId: '1', date: new Date('2024-06-18T14:00:00Z'), portOfSupply: 'Singapore', supplierName: 'MediSupplies Inc.', trackingNumber: 'MS123456789SG', status: 'Delivered', notes: 'Full order received.', items: [] },
    { id: 'sup2', shipId: '1', date: new Date('2024-07-10T09:00:00Z'), portOfSupply: 'Rotterdam', supplierName: 'Euro Pharma', trackingNumber: 'EP987654321NL', status: 'Shipped', notes: 'Partial shipment. Remainder to follow.', items: [] },
];

let medicines: Medicine[] = [
    // Medicines
    { id: 'med1', name: 'Acetylsalicylic acid', type: 'Medicine', form: 'tab', strength: '300mg', indication: 'pain, fever, blood clots', notes: null, category: null },
    { id: 'med2', name: 'Aciclovir', type: 'Medicine', form: 'tab', strength: '400mg', indication: 'herpes simples/zoster', notes: null, category: null },
    { id: 'med3', name: 'Adrenaline', type: 'Medicine', form: 'amp', strength: '1 mg/ml', indication: 'anaphylaxis', notes: null, category: null },
    { id: 'med4', name: 'Amoxicillin + clavulanic acid', type: 'Medicine', form: 'tab', strength: '875mg/125mg', indication: 'infections', notes: null, category: null },
    { id: 'med5', name: 'Artemether', type: 'Medicine', form: 'amp', strength: '80mg/ml', indication: 'malaria treatment', notes: null, category: null },
    { id: 'med6', name: 'Artemether + Lumefantrine', type: 'Medicine', form: 'tab', strength: '20mg/120mg', indication: 'malaria treatment', notes: 'double if crew size > 30', category: null },
    { id: 'med7', name: 'Atropine', type: 'Medicine', form: 'amp', strength: '1.2mg/ml', indication: 'MI/organophosphate poisoning', notes: 'double quantity if carrying organophosphates', category: null },
    { id: 'med8', name: 'Azithromycin', type: 'Medicine', form: 'tab', strength: '500mg', indication: 'infections', notes: null, category: null },
       // Equipment
    { id: 'eq1', name: 'Portable oxygen set, complete', type: 'Equipment', form: 'set', strength: null, indication: 'Appliance for the administration of oxygen', notes: 'containing: 1 oxygen cylinder, 1 spare, pressure regulator, and 3 face masks', category: 'Resuscitation' },
    { id: 'eq2', name: 'Oropharyngeal airway (Guedel)', type: 'Equipment', form: 'airway', strength: 'medium and large', indication: 'Oropharyngeal airway', notes: 'Mayo-tube', category: 'Resuscitation' },
    { id: 'eq3', name: 'Mechanical aspirator', type: 'Equipment', form: 'aspirator', strength: null, indication: 'Manual aspirator to clear upper airways', notes: 'including 2 catheters', category: 'Resuscitation' },
    { id: 'eq4', name: 'Bag and mask resuscitator', type: 'Equipment', form: 'resuscitator', strength: null, indication: 'Ambubag (or equivalent)', notes: 'supplied with large, medium and small masks', category: 'Resuscitation' },
    { id: 'eq5', name: 'Cannula for mouth-to-mouth resuscitation', type: 'Equipment', form: 'cannula', strength: null, indication: 'Brook Airway, Lifeway, pocket face mask or equivalent', notes: null, category: 'Resuscitation' },
    { id: 'eq6', name: 'Adhesive dressings', type: 'Equipment', form: 'strips', strength: null, indication: 'Assorted wound-plaster or plaster strips', notes: 'water-resistant', category: 'Dressing Material and Suturing Equipment' },
    { id: 'eq7', name: 'Eye pads', type: 'Equipment', form: 'pads', strength: null, indication: 'Eye pads', notes: null, category: 'Dressing Material and Suturing Equipment' },
    { id: 'eq8', name: 'Sterile gauze compresses, 5x5 cm', type: 'Equipment', form: 'compresses', strength: '5x5 cm', indication: 'Sterile gauze compresses, sterile', notes: null, category: 'Dressing Material and Suturing Equipment' },
    { id: 'eq9', name: 'Sterile gauze compresses, 10x10 cm', type: 'Equipment', form: 'compresses', strength: '10x10 cm', indication: 'Sterile gauze compresses, sterile', notes: null, category: 'Dressing Material and Suturing Equipment' },
      { id: 'eq84', name: 'Thermometer for refrigerator', type: 'Equipment', form: 'thermometer for refrigerator', strength: null, indication: 'Thermometer for refrigerator', notes: null, category: 'General medical and nursing equipment' },
];

let shipInventory: { [key: string]: InventoryItem[] } = {
  '1': [
    { id: 'inv1', shipId: '1', medicineId: 'med1', medicineName: "Acetylsalicylic acid", medicineCategory: 'Uncategorized', type: 'Medicine', totalQuantity: 45, requiredQuantity: 50, batches: [
      { id: 'batch1', inventoryItemId: 'inv1', quantity: 20, batchNumber: 'A123', expiryDate: new Date('2025-02-20T10:00:00Z'), manufacturerName: 'Aspirin' },
      { id: 'batch2', inventoryItemId: 'inv1', quantity: 25, batchNumber: 'B456', expiryDate: new Date('2024-08-20T10:00:00Z'), manufacturerName: 'Disprin' },
    ] },
    { id: 'inv2', shipId: '1', medicineId: 'med2', medicineName: "Aciclovir", medicineCategory: 'Uncategorized', type: 'Medicine', totalQuantity: 60, requiredQuantity: 70, batches: [
      { id: 'batch3', inventoryItemId: 'inv2', quantity: 60, batchNumber: 'C789', expiryDate: new Date('2024-06-10T10:00:00Z') },
    ] },
     { id: 'inv4', shipId: '1', medicineId: 'eq1', medicineName: "Portable oxygen set, complete", medicineCategory: 'Resuscitation', type: 'Equipment', totalQuantity: 1, requiredQuantity: 1, batches: [
      { id: 'batch5', inventoryItemId: 'inv4', quantity: 1, batchNumber: null, expiryDate: null },
    ] },
  ],
  '2': [
    { id: 'inv3', shipId: '2', medicineId: 'med1', medicineName: "Acetylsalicylic acid", medicineCategory: 'Uncategorized', type: 'Medicine', totalQuantity: 40, requiredQuantity: 50, batches: [
      { id: 'batch4', inventoryItemId: 'inv3', quantity: 40, batchNumber: 'D111', expiryDate: new Date('2025-06-20T10:00:00Z'), manufacturerName: 'Aspirin' },
    ] },
  ],
};

const defaultRequirements: (Omit<FlagRequirement, "medicineId">)[] = [
    // Medicines
    { categoryA: '50', categoryB: '50', categoryC: '-' },
    { categoryA: '70+', categoryB: '35+', categoryC: '-' },
    { categoryA: '10+', categoryB: '5+', categoryC: '5+' },
    { categoryA: '20', categoryB: '10', categoryC: '-' },
    { categoryA: '12+', categoryB: '12+', categoryC: '-' },
    { categoryA: '24+', categoryB: '24+', categoryC: '-' },
    { categoryA: '10+', categoryB: '5+', categoryC: '-' },
    { categoryA: '10+', categoryB: '5+', categoryC: '-' },
    { categoryA: '15', categoryB: '5+', categoryC: '-' },
    { categoryA: '30+', categoryB: '30+', categoryC: '-' },
    { categoryA: '120g+', categoryB: '120g+', categoryC: '-' },
    { categoryA: '20+', categoryB: '10+', categoryC: '-' },
    { categoryA: '10ml', categoryB: '10ml+', categoryC: '-' },
    { categoryA: '3', categoryB: '1', categoryC: '-' },
    { categoryA: '50+', categoryB: '20+', categoryC: '-' },
    { categoryA: '30+', categoryB: '-', categoryC: '-' },
    { categoryA: '10', categoryB: '-', categoryC: '-' },
    { categoryA: '500ml', categoryB: '500ml+', categoryC: '100ml+' },
    { categoryA: '500ml', categoryB: '100ml', categoryC: '-' },
    { categoryA: '20+', categoryB: '20+', categoryC: '-' },
    { categoryA: '5+', categoryB: '5+', categoryC: '-' },
    { categoryA: '1+', categoryB: '1+', categoryC: '-' },
    { categoryA: '5', categoryB: '5+', categoryC: '-' },
    { categoryA: '2x30g', categoryB: '1x30g', categoryC: '-' },
    { categoryA: '100', categoryB: '50', categoryC: '50+' },
    { categoryA: '10', categoryB: '10', categoryC: '5+' },
    { categoryA: '5', categoryB: '5', categoryC: '-' },
    { categoryA: '30', categoryB: '30', categoryC: '10+' },
    { categoryA: '6+', categoryB: '6+', categoryC: '-' },
    { categoryA: '60+', categoryB: '-', categoryC: '-' },
    { categoryA: '30+', categoryB: '20+', categoryC: '-' },
    { categoryA: '2x30g', categoryB: '1x30g', categoryC: '-' },
    { categoryA: '10+', categoryB: '5+', categoryC: '-' },
    { categoryA: '3+', categoryB: '3+', categoryC: '-' },
    { categoryA: '10', categoryB: '10', categoryC: '-' },
    { categoryA: '100ml+', categoryB: '100ml+', categoryC: '-' },
    { categoryA: '10+', categoryB: '5+', categoryC: '-' },
    { categoryA: '30+', categoryB: '30+', categoryC: '-' },
    { categoryA: '10', categoryB: '10', categoryC: '10+' },
    { categoryA: '15l(75)', categoryB: '10l(50)', categoryC: '2l(10)+' },
    { categoryA: '2', categoryB: '1', categoryC: '-' },
    { categoryA: '100', categoryB: '50', categoryC: '25' },
    { categoryA: '200ml+', categoryB: '100ml+', categoryC: '-' },
    { categoryA: '300ml+', categoryB: '100ml+', categoryC: '-' },
    { categoryA: '100ml', categoryB: '100ml', categoryC: '100ml+' },
    { categoryA: '1x25g', categoryB: '1x25g', categoryC: '-' },
    { categoryA: '30+', categoryB: '30+', categoryC: '-' },
    { categoryA: '1', categoryB: '1', categoryC: '-' },
    { categoryA: '5+', categoryB: '1', categoryC: '-' },
    { categoryA: '20+', categoryB: '20+', categoryC: '-' },
    { categoryA: '2', categoryB: '1', categoryC: '1+' },
    { categoryA: '2+', categoryB: '2+', categoryC: '-' },
    { categoryA: '15', categoryB: '5+', categoryC: '-' },
    { categoryA: '56+', categoryB: '56+', categoryC: '-' },
    { categoryA: '200g+', categoryB: '100g+', categoryC: '100g+' },
    // Equipment
    { quantity: '1' }, // eq1
    { quantity: '2' }, // eq2
    { quantity: '1' }, // eq3
    { quantity: '1' }, // eq4
    { quantity: '1' }, // eq5
    { quantity: '200' }, // eq6
    { quantity: '3' }, // eq7
    { quantity: '100' }, // eq8
    { quantity: '100' }, // eq9
    { quantity: '1' }, // eq10
    { quantity: '100' }, // eq11
    { quantity: '50' }, // eq12
    { quantity: '3' }, // eq13
    { quantity: '5' }, // eq14
    { quantity: '1' }, // eq15
    { quantity: '10' }, // eq16
    { quantity: '5' }, // eq17
    { quantity: '1' }, // eq18
    { quantity: '1' }, // eq19
    { quantity: '10' }, // eq20
    { quantity: '100' }, // eq21
    { quantity: '50' }, // eq22
    { quantity: '20' }, // eq23
    { quantity: '2' }, // eq24
    { quantity: '10' }, // eq25 - 10 each
    { quantity: '50' }, // eq26
    { quantity: '9' },  // eq27 - 3 of each size (3x3)
    { quantity: '20' }, // eq28
    { quantity: '1' },  // eq29
    { quantity: '1' },  // eq30
    { quantity: '1' },  // eq31
    { quantity: '3' },  // eq32
    { quantity: '1' },  // eq33
    { quantity: '1' },  // eq34
    { quantity: '3' },  // eq35
    { quantity: '50' }, // eq36
    { quantity: '100' },// eq37
    { quantity: '100' },// eq38
    { quantity: '100' },// eq39
    { quantity: '1' },  // eq40
    { quantity: '1' },  // eq41
    { quantity: '1' },  // eq42
    { quantity: '1' },  // eq43
    { quantity: '1' },  // eq44
    { quantity: '1' },  // eq45
    { quantity: '1' },  // eq46
    { quantity: '1' },  // eq47
    { quantity: '50' }, // eq48
    { quantity: '50' }, // eq49
    { quantity: '20' }, // eq50
    { quantity: '20' }, // eq51
    { quantity: '20' }, // eq52
    { quantity: '10' }, // eq53 - 10 each
    { quantity: '3' }, // eq54
    { quantity: '1' }, // eq55
    { quantity: '2' }, // eq56
    { quantity: '2' }, // eq57
    { quantity: '2' }, // eq58
    { quantity: '2' }, // eq59
    { quantity: '20' }, // eq60
    { quantity: '2' }, // eq61
    { quantity: '10' }, // eq62
    { quantity: '1' }, // eq63
    { quantity: '50' }, // eq64
    { quantity: '1' }, // eq65
    { quantity: '2' }, // eq66
    { quantity: '1' }, // eq67
    { quantity: '1' }, // eq68
    { quantity: '1' }, // eq69
    { quantity: '1' }, // eq70
    { quantity: '1' }, // eq71
    { quantity: '100' }, // eq72
    { quantity: '1' }, // eq73
    { quantity: '3' }, // eq74
    { quantity: '1' }, // eq75
    { quantity: '20' }, // eq76
    { quantity: '3' }, // eq77
    { quantity: '10' }, // eq78
    { quantity: '12' }, // eq79 - 12 each
    { quantity: '1' }, // eq80 - 1 each
    { quantity: '10' }, // eq81
    { quantity: '200' }, // eq82
    { quantity: '1' }, // eq83
    { quantity: '1' }, // eq84
];

const fullDefaultRequirements = medicines.map((med, index) => ({
    medicineId: med.id,
    ...defaultRequirements[index]
}));


let flagRequirements: Record<Flag, FlagRequirement[]> = {
    "Panama": JSON.parse(JSON.stringify(fullDefaultRequirements)),
    "Liberia": JSON.parse(JSON.stringify(fullDefaultRequirements)),
    "Marshall Islands": JSON.parse(JSON.stringify(fullDefaultRequirements)),
    "Hong Kong": JSON.parse(JSON.stringify(fullDefaultRequirements)),
    "Singapore": JSON.parse(JSON.stringify(fullDefaultRequirements)),
    "India": JSON.parse(JSON.stringify(fullDefaultRequirements)),
    "Cayman Islands": JSON.parse(JSON.stringify(fullDefaultRequirements)),
};


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
    
