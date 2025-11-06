import { Document, Schema, Types, model, models } from 'mongoose';
import { INonMedicalConsumptionLog, NonMedicalConsumptionReasons } from '../types';

export interface INonMedicalConsumptionDoc extends INonMedicalConsumptionLog, Document {
  shipId: Types.ObjectId;
}

const nonMedicalConsumptionSchema = new Schema<INonMedicalConsumptionDoc>(
  {
    shipId: { type: Schema.Types.ObjectId, ref: 'Ship', required: true },
    date: { type: Date, required: true },
    medicineId: { type: Schema.Types.ObjectId, ref: 'Medicine', required: true },
    medicineName: String,
    batchId: { type: Schema.Types.ObjectId, ref: 'Batch', default: null },
    batchNumber: String,
    quantity: { type: Number, required: true, min: 0 },
    reason: { type: String, enum: NonMedicalConsumptionReasons, required: true },
    notes: String,
  },
  { timestamps: true }
);

nonMedicalConsumptionSchema.index({ shipId: 1 });
nonMedicalConsumptionSchema.index({ date: -1 });

export const NonMedicalConsumptionLog =
  models.NonMedicalConsumptionLog ||
  model<INonMedicalConsumptionDoc>('NonMedicalConsumptionLog', nonMedicalConsumptionSchema);
