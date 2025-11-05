import { Document, Schema, model } from 'mongoose';
import { ICompany } from '../types';

interface ICompanyDoc extends ICompany, Document {}

const contactSchema = new Schema({
  name: String,
  email: String,
  phone: String,
  phone2: String,
});

const companySchema = new Schema<ICompanyDoc>(
  {
    name: { type: String, required: true },
    address: String,
    phone: String,
    pic: contactSchema,
    doctor: contactSchema,
    medicalLogFormNumber: String,
  },
  { timestamps: true }
);

export const Company = model<ICompanyDoc>('Company', companySchema);
