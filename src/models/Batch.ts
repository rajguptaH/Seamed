import { Document, Schema, Types, model, models } from 'mongoose';
import { IBatch } from '../types';

interface IBatchDoc extends IBatch, Document {
  inventoryItemId: Types.ObjectId;
}

const batchSchema = new Schema<IBatchDoc>(
  {
    inventoryItemId: { type: Schema.Types.ObjectId, ref: 'InventoryItem', required: true },
    quantity: { type: Number, required: true },
    batchNumber: String,
    expiryDate: Date,
    manufacturerName: String,
  },
  { timestamps: true }
);


export const Batch = models.Batch || model<IBatchDoc>("Batch", batchSchema);
