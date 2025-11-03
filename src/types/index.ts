

export interface PersonInCharge {
  name: string;
  email: string;
  phone: string;
  phone2?: string;
}

export interface CompanyDoctor {
  name: string;
  email: string;
  phone: string;
  phone2?: string;
}

export interface Company {
  id: string;
  name: string;
  address: string;
  phone: string;
  pic: PersonInCharge;
  doctor: CompanyDoctor;
  medicalLogFormNumber?: string;
}

export type VesselCategory = 'A' | 'B' | 'C';

export interface Ship {
  id: string;
  name: string;
  imo: string;
  flag: Flag;
  crewCount: number;
  companyId: string;
  category: VesselCategory;
}

export interface Medicine {
  id: string;
  name: string;
  type: 'Medicine' | 'Equipment';
  category?: string | null;
  form: string;
  strength: string | null;
  indication: string;
  notes: string | null;
}

export type Flag = 'Panama' | 'Liberia' | 'Marshall Islands' | 'Hong Kong' | 'Singapore' | 'India' | 'Cayman Islands';

export interface Batch {
  id: string;
  inventoryItemId: string;
  quantity: number;
  batchNumber: string | null;
  expiryDate: Date | null;
  manufacturerName?: string | null;
}

export interface InventoryItem {
  id: string;
  shipId: string;
  medicineId: string;
  medicineName: string;
  medicineCategory: string;
  type: 'Medicine' | 'Equipment';
  requiredQuantity: number;
  totalQuantity: number;
  batches: Batch[];
}

export interface MedicalLog {
  id: string;
  shipId: string;
  date: Date;
  crewMemberName: string;
  rank: string;
  caseDescription: string;
  medicineUsedId: string;
  batchUsedId: string;
  quantityUsed: number;
  notes: string | null;
  batchNumber?: string | null;
  expiryDate?: Date | null;
  photoUrl?: string | null;
}

export const NonMedicalConsumptionReasons = ['Damaged', 'Expired', 'Lost', 'Other'] as const;
export type NonMedicalConsumptionReason = typeof NonMedicalConsumptionReasons[number];

export interface NonMedicalConsumptionLog {
  id: string;
  shipId: string;
  date: Date;
  medicineId: string;
  medicineName?: string;
  batchId: string;
  batchNumber?: string;
  quantity: number;
  reason: NonMedicalConsumptionReason;
  notes: string | null;
}

export const SupplyLogStatuses = ['Pending', 'Shipped', 'Delivered', 'Cancelled'] as const;
export type SupplyLogStatus = typeof SupplyLogStatuses[number];

export interface SuppliedItem {
    id: string;
    supplyLogId: string;
    medicineId: string;
    medicineName: string; // Denormalized for display
    manufacturerName: string | null;
    batchNumber: string | null;
    expiryDate: Date | null;
    quantity: number;
}

export interface SupplyLog {
    id: string;
    shipId: string;
    date: Date;
    portOfSupply: string;
    supplierName: string;
    trackingNumber: string | null;
    status: SupplyLogStatus;
    notes: string | null;
    orderListUrl?: string | null;
    orderListFilename?: string | null;
    items: SuppliedItem[];
}


export interface FlagRequirement {
    medicineId: string;
    // For Medicines
    categoryA?: string;
    categoryB?: string;
    categoryC?: string;
    // For Equipment
    quantity?: string;
}
