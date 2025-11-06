import { Document, Schema, Types, model, models } from "mongoose";
import { IFlagRequirement } from "../types";

export interface IFlagRequirementDoc extends IFlagRequirement, Document {
  medicineId: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const flagRequirementSchema = new Schema<IFlagRequirementDoc>(
  {
    medicineId: {
      type: Schema.Types.ObjectId,
      ref: "Medicine",
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
  {
    timestamps: true, // optional but useful
  }
);

// --- Indexes ---
flagRequirementSchema.index({ medicineId: 1 });

// --- Model Export ---
// ✅ Prevent OverwriteModelError in Next.js dev mode
export const FlagRequirement =
  models.FlagRequirement ||
  model<IFlagRequirementDoc>("FlagRequirement", flagRequirementSchema);
