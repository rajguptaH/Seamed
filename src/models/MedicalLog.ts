import { Document, Schema, Types, model } from 'mongoose';
import { IMedicalLog } from '../types';

export interface IMedicalLogDoc extends IMedicalLog, Document {
  shipId: Types.ObjectId;
  medicineUsedId?: Types.ObjectId;
  batchUsedId?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

// --- Schema Definition ---
const medicalLogSchema = new Schema<IMedicalLogDoc>(
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
    crewMemberName: {
      type: String,
      required: true,
      trim: true,
    },
    rank: {
      type: String,
      required: true,
      trim: true,
    },
    caseDescription: {
      type: String,
      required: true,
      trim: true,
    },
    medicineUsedId: {
      type: Schema.Types.ObjectId,
      ref: 'Medicine',
      default: null,
    },
    batchUsedId: {
      type: Schema.Types.ObjectId,
      ref: 'Batch',
      default: null,
    },
    quantityUsed: {
      type: Number,
      required: true,
      min: [0, 'Quantity used cannot be negative'],
    },
    notes: {
      type: String,
      default: null,
      trim: true,
    },
    batchNumber: {
      type: String,
      trim: true,
      default: null,
    },
    expiryDate: {
      type: Date,
      default: null,
    },
    photoUrl: {
      type: String,
      trim: true,
      default: null,
    },
  },  
);

// --- Indexes for Query Performance ---
medicalLogSchema.index({ shipId: 1 });
medicalLogSchema.index({ date: -1 });
medicalLogSchema.index({ crewMemberName: 1 });
medicalLogSchema.index({ medicineUsedId: 1 });
medicalLogSchema.index({ batchUsedId: 1 });

// --- Model Export ---
export const MedicalLog = model<IMedicalLogDoc>('MedicalLog', medicalLogSchema);
