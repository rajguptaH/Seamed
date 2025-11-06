// 📄 src/models/InventoryItem.ts
import { Document, model, Schema, Types } from "mongoose";
import { IInventoryItem } from "../types";

interface IInventoryItemDoc extends IInventoryItem, Document {
  shipId: Types.ObjectId;
  medicineId: Types.ObjectId;
  batches: Types.ObjectId[];
}

const inventoryItemSchema = new Schema<IInventoryItemDoc>(
  {
    shipId: { type: Schema.Types.ObjectId, ref: "Ship", required: true },
    medicineId: { type: Schema.Types.ObjectId, ref: "Medicine", required: true },
    medicineName: String,
    medicineCategory: String,
    type: String,
    requiredQuantity: Number,
    totalQuantity: Number,
    batches: [{ type: Schema.Types.ObjectId, ref: "Batch" }], // ✅ ref matches model name
  },
  { timestamps: true }
);

export const InventoryItem = model<IInventoryItemDoc>(
  "InventoryItem",
  inventoryItemSchema
);
