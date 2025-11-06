import { Document, Schema, Types, model, models } from 'mongoose';
import { ISuppliedItem, ISupplyLog } from '../types';

interface ISupplyLogDoc extends ISupplyLog, Document {
  shipId: Types.ObjectId;
}

const suppliedItemSchema = new Schema<ISuppliedItem>(
  {
    medicineId: { type: Schema.Types.ObjectId, ref: 'Medicine', required: true },
    medicineName: { type: String, required: true },
    manufacturerName: String,
    batchNumber: String,
    expiryDate: Date,
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
    trackingNumber: String,
    status: {
      type: String,
      enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    notes: String,
    orderListUrl: String,
    orderListFilename: String,
    items: [suppliedItemSchema],
  },
  { timestamps: true }
);

export const SupplyLog = models.SupplyLog || model<ISupplyLogDoc>('SupplyLog', supplyLogSchema);
