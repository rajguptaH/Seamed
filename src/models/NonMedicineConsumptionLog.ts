import { Document, Schema, Types, model } from 'mongoose';
import { INonMedicalConsumptionLog, NonMedicalConsumptionReasons } from '../types';

export interface INonMedicalConsumptionDoc extends INonMedicalConsumptionLog, Document {
  shipId: Types.ObjectId;
  medicineId: Types.ObjectId;
  batchId?: Types.ObjectId | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// --- Schema Definition ---
const nonMedicalConsumptionSchema = new Schema<INonMedicalConsumptionDoc>(
  {
    shipId: {
      type: Schema.Types.ObjectId,
      ref: 'Ship',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    medicineId: {
      type: Schema.Types.ObjectId,
      ref: 'Medicine',
      required: true,
    },
    medicineName: {
      type: String,
      trim: true,
      default: null,
    },
    batchId: {
      type: Schema.Types.ObjectId,
      ref: 'Batch',
      default: null,
    },
    batchNumber: {
      type: String,
      trim: true,
      default: null,
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, 'Quantity cannot be negative'],
    },
    reason: {
      type: String,
      enum: NonMedicalConsumptionReasons,
      required: true,
    },
    notes: {
      type: String,
      trim: true,
      default: null,
    },
  },
  
);

// --- Indexes ---
nonMedicalConsumptionSchema.index({ shipId: 1 });
nonMedicalConsumptionSchema.index({ date: -1 });
nonMedicalConsumptionSchema.index({ medicineId: 1 });
nonMedicalConsumptionSchema.index({ reason: 1 });

// --- Model Export ---
export const NonMedicalConsumptionLog = model<INonMedicalConsumptionDoc>(
  'NonMedicalConsumptionLog',
  nonMedicalConsumptionSchema
);