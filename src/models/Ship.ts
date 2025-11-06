import { Document, Schema, Types, model, models } from 'mongoose';
import { IShip } from '../types';

export interface IShipDoc extends IShip, Document {
  companyId: Types.ObjectId;
}

const shipSchema = new Schema<IShipDoc>(
  {
    name: { type: String, required: true, trim: true },
    imo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^\d{7}$/, 'IMO number must be 7 digits'],
    },
    flag: {
      type: String,
      enum: [
        'Panama',
        'Liberia',
        'Marshall Islands',
        'Hong Kong',
        'Singapore',
        'India',
        'Cayman Islands',
      ],
      required: true,
    },
    crewCount: { type: Number, required: true, min: 1 },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    category: { type: String, enum: ['A', 'B', 'C'], required: true },
  },
  { timestamps: true }
);

shipSchema.index({ companyId: 1 });
shipSchema.index({ flag: 1 });

export const Ship = models.Ship || model<IShipDoc>('Ship', shipSchema);
