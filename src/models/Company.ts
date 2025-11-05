import { Document, model, Schema } from 'mongoose';
import { ICompany } from '../types';

// Remove the interface extending Document
export type ICompanyDoc = Omit<ICompany, 'id'> & Document;

const personInChargeSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    phone2: String,
  },
  { _id: true } // automatically creates an ObjectId
);

const doctorSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    phone2: String,
  },
  { _id: true }
);

const companySchema = new Schema<ICompanyDoc>(
  {
    name: { type: String, required: true },
    address: String,
    phone: String,
    pic: { type: personInChargeSchema, required: true },
    doctor: { type: doctorSchema, required: true },
    medicalLogFormNumber: String,
  },
  { timestamps: true }
);

export const Company = model<ICompanyDoc>('Company', companySchema);
