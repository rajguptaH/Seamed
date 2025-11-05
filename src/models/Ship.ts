import { Document, Schema, Types, model } from 'mongoose';
import { IShip } from '../types';
export interface IShipDoc extends IShip, Document {
  companyId: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

// --- Schema Definition ---
const shipSchema = new Schema<IShipDoc>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    imo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^\d{7}$/, 'IMO number must be a 7-digit numeric string'],
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
    crewCount: {
      type: Number,
      required: true,
      min: [1, 'A ship must have at least one crew member'],
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    category: {
      type: String,
      enum: ['A', 'B', 'C'],
      required: true,
    },
  },  
);

// --- Indexes for Query Performance ---
shipSchema.index({ imo: 1 }, { unique: true });
shipSchema.index({ companyId: 1 });
shipSchema.index({ flag: 1 });
shipSchema.index({ category: 1 });

// --- Model Export ---
export const Ship = model<IShipDoc>('Ship', shipSchema);