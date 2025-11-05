import { Document, Schema, model } from 'mongoose';
import { IMedicine } from '../types';

interface IMedicineDoc extends IMedicine, Document {}

const medicineSchema = new Schema<IMedicineDoc>(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ['Medicine', 'Equipment'], required: true },
    category: String,
    form: String,
    strength: String,
    indication: String,
    notes: String,
  },
  { timestamps: true }
);

export const Medicine = model<IMedicineDoc>('Medicine', medicineSchema);
