import { Document, Schema, Types, model } from 'mongoose';
import { IInventoryItem } from '../types';

export interface IInventoryItemDoc extends IInventoryItem, Document {
  shipId: Types.ObjectId;
  medicineId: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

// --- Schema Definition ---
const inventoryItemSchema = new Schema<IInventoryItemDoc>(
  {
    shipId: {
      type: Schema.Types.ObjectId,
      ref: 'Ship',
      required: true,
    },
    medicineId: {
      type: Schema.Types.ObjectId,
      ref: 'Medicine',
      required: true,
    },
    medicineName: {
      type: String,
      required: true,
      trim: true,
    },
    medicineCategory: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['Medicine', 'Equipment'],
      required: true,
    },
    requiredQuantity: {
      type: Number,
      required: true,
      min: [0, 'Required quantity cannot be negative'],
    },
    totalQuantity: {
      type: Number,
      required: true,
      min: [0, 'Total quantity cannot be negative'],
    },
    batches: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Batch',
        default: [],
      },
    ],
  },  
);

// --- Indexes ---
inventoryItemSchema.index({ shipId: 1 });
inventoryItemSchema.index({ medicineId: 1 });
inventoryItemSchema.index({ type: 1 });
inventoryItemSchema.index({ shipId: 1, medicineId: 1 }, { unique: true });

// --- Model Export ---
export const InventoryItem = model<IInventoryItemDoc>('InventoryItem', inventoryItemSchema);