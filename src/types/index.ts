// src/types/index.ts

import { Types } from "mongoose";

export interface IPersonInCharge {

  name: string;
  email: string;
  phone: string;
  phone2?: string;
}

export interface ICompanyDoctor {

  name: string;
  email: string;
  phone: string;
  phone2?: string;
}

export interface ICompany {

  name: string;
  address: string;
  phone: string;
  pic: IPersonInCharge;
  doctor: ICompanyDoctor;
  medicalLogFormNumber?: string;
}

export type VesselCategory = 'A' | 'B' | 'C';
export type IFlag =
  | 'Panama'
  | 'Liberia'
  | 'Marshall Islands'
  | 'Hong Kong'
  | 'Singapore'
  | 'India'
  | 'Cayman Islands';

export interface IShip {

  name: string;
  imo: string;
  flag: IFlag;
  crewCount: number;
  companyId: string | Types.ObjectId;
  category: VesselCategory;
}

export interface IMedicine {

  name: string;
  type: 'Medicine' | 'Equipment';
  category?: string | null;
  form: string;
  strength: string | null;
  indication: string;
  notes: string | null;
}

export interface IBatch {

  inventoryItemId: string | Types.ObjectId;
  quantity: number;
  batchNumber: string | null;
  expiryDate: Date | null;
  manufacturerName?: string | null;
}
export interface IInventoryItem {

  shipId: string | Types.ObjectId;
  medicineId: string | Types.ObjectId;
  medicineName: string;
  medicineCategory: string;
  type: 'Medicine' | 'Equipment';
  requiredQuantity: number;
  totalQuantity: number;
  batches: (string | Types.ObjectId | IBatch)[];
}

export interface IMedicalLog {

  shipId: string | Types.ObjectId;
  date: Date;
  crewMemberName: string;
  rank: string;
  caseDescription: string;
  medicineUsedId?: string | Types.ObjectId;
  batchUsedId?: string | Types.ObjectId;
  quantityUsed: number;
  notes?: string | null;
  batchNumber?: string | null;
  expiryDate?: Date | null;
  photoUrl?: string | null;
}

export const NonMedicalConsumptionReasons = ['Damaged', 'Expired', 'Lost', 'Other'] as const;
export type NonMedicalConsumptionReason = typeof NonMedicalConsumptionReasons[number];

export interface INonMedicalConsumptionLog {

  shipId: string | Types.ObjectId;
  date: Date;
  medicineId: string | Types.ObjectId;
  medicineName?: string | null;
  batchId?: string | Types.ObjectId | null;
  batchNumber?: string | null;
  quantity: number;
  reason: NonMedicalConsumptionReason;
  notes?: string | null;
}

export const SupplyLogStatuses = ['Pending', 'Shipped', 'Delivered', 'Cancelled'] as const;
export type SupplyLogStatus = typeof SupplyLogStatuses[number];

export interface ISuppliedItem {
  medicineId: string | Types.ObjectId;
  medicineName: string;
  manufacturerName?: string;
  batchNumber?: string;
  expiryDate?: Date;
  quantity: number;
}



export interface ISupplyLog {

  shipId: string | Types.ObjectId;
  date: Date;
  portOfSupply: string;
  supplierName: string;
  trackingNumber?: string | null;
  status: SupplyLogStatus;
  notes?: string | null;
  orderListUrl?: string | null;
  orderListFilename?: string | null;
  items: ISuppliedItem[];
}

export interface IFlagRequirement {
  medicineId: string | Types.ObjectId;
  categoryA?: string | null;
  categoryB?: string | null;
  categoryC?: string | null;
  quantity?: string | null;
}
