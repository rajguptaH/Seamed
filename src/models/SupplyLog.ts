import { Document, Schema, Types, model } from 'mongoose';
import { ISuppliedItem, ISupplyLog } from '../types';

interface ISupplyLogDoc extends ISupplyLog, Document {
  shipId: Types.ObjectId;
}

// Embedded schema for supplied items
const suppliedItemSchema = new Schema<ISuppliedItem>(
  {
    medicineId: { type: Schema.Types.ObjectId, ref: 'Medicine', required: true },
    medicineName: { type: String, required: true },
    manufacturerName: { type: String },
    batchNumber: { type: String },
    expiryDate: { type: Date },
    quantity: { type: Number, required: true },
  },
  { _id: false }
);

const supplyLogSchema = new Schema<ISupplyLogDoc>(
  {
    shipId: { type: Schema.Types.ObjectId, ref: 'Ship', required: true },
    date: { type: Date, required: true },
    portOfSupply: { type: String, required: true },
    supplierName: { type: String, required: true },
    trackingNumber: { type: String },
    status: {
      type: String,
      enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    notes: { type: String },
    orderListUrl: { type: String },
    orderListFilename: { type: String },
    items: { type: [suppliedItemSchema], default: [] },
  },
  { timestamps: true }
);

export const SupplyLog = model<ISupplyLogDoc>('SupplyLog', supplyLogSchema);
