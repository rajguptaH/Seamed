import { Document, Schema, Types, model, models } from 'mongoose';
import { IMedicalLog } from '../types';

export interface IMedicalLogDoc extends IMedicalLog, Document {
  shipId: Types.ObjectId;
}

const medicalLogSchema = new Schema<IMedicalLogDoc>(
  {
    shipId: { type: Schema.Types.ObjectId, ref: 'Ship', required: true },
    date: { type: Date, required: true },
    crewMemberName: { type: String, required: true, trim: true },
    rank: { type: String, required: true, trim: true },
    caseDescription: { type: String, required: true, trim: true },
    medicineUsedId: { type: Schema.Types.ObjectId, ref: 'Medicine', default: null },
    batchUsedId: { type: Schema.Types.ObjectId, ref: 'Batch', default: null },
    quantityUsed: { type: Number, required: true, min: 0 },
    notes: String,
    batchNumber: String,
    expiryDate: Date,
    photoUrl: String,
  },
  { timestamps: true }
);

medicalLogSchema.index({ shipId: 1 });
medicalLogSchema.index({ date: -1 });

export const MedicalLog =
  models.MedicalLog || model<IMedicalLogDoc>('MedicalLog', medicalLogSchema);
