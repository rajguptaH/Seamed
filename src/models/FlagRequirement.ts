import { Document, Schema, Types, model, models } from "mongoose";
import { IFlagRequirement } from "../types";

export interface IFlagRequirementDoc extends IFlagRequirement, Document {
  medicineId: Types.ObjectId;
}

const flagRequirementSchema = new Schema<IFlagRequirementDoc>(
  {
    medicineId: { type: Schema.Types.ObjectId, ref: "Medicine", required: true },
    categoryA: String,
    categoryB: String,
    categoryC: String,
    quantity: String,
  },
  { timestamps: true }
);

flagRequirementSchema.index({ medicineId: 1 });

export const FlagRequirement =
  models.FlagRequirement || model<IFlagRequirementDoc>("FlagRequirement", flagRequirementSchema);
