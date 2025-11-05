import { Document, Schema, Types, model } from 'mongoose';
import { IFlagRequirement } from '../types';
export interface IFlagRequirementDoc extends IFlagRequirement, Document {
  medicineId: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}



const flagRequirementSchema = new Schema<IFlagRequirementDoc>(
  {
    medicineId: {
      type: Schema.Types.ObjectId,
      ref: 'Medicine',
      required: true,
    },
    categoryA: {
      type: String,
      trim: true,
      default: null,
    },
    categoryB: {
      type: String,
      trim: true,
      default: null,
    },
    categoryC: {
      type: String,
      trim: true,
      default: null,
    },
    quantity: {
      type: String,
      trim: true,
      default: null,
    },
  },  
);

// --- Indexes ---
flagRequirementSchema.index({ medicineId: 1 });

// --- Model Export ---
export const FlagRequirement = model<IFlagRequirementDoc>('FlagRequirement', flagRequirementSchema);