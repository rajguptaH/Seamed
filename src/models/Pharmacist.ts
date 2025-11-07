import mongoose, { Document, Schema } from "mongoose";

export interface IPharmacist extends Document {
  name: string;
  licenseNumber: string;
  signature: string; // could also be a URL if you store an image
  supplier: {
    name: string;
    address: string;
    stateLicense: string;
    tel: string;
  };
}

const SupplierSchema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  stateLicense: { type: String, required: true },
  tel: { type: String, required: true },
});

const PharmacistSchema = new Schema<IPharmacist>({
  name: { type: String, required: true },
  licenseNumber: { type: String, required: true },
  signature: { type: String, required: true },
  supplier: { type: SupplierSchema, required: true },
});

export const Pharmacist = mongoose.model<IPharmacist>("Pharmacist", PharmacistSchema);
