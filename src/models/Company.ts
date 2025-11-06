// src/models/Company.ts
import { Document, Schema, model, models } from 'mongoose';
import { ICompany } from '../types';

export type ICompanyDoc = Omit<ICompany, 'id'> & Document;

const personInChargeSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    phone2: String,
  },
  { _id: false }
);

const doctorSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    phone2: String,
  },
  { _id: false }
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

export const Company = models.Company || model<ICompanyDoc>('Company', companySchema);
