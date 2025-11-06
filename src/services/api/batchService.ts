import { connectDB } from "@/config/db";
import { Batch } from "@/models/Batch";


/**
 * Get all batches
 */
export async function getBatches() {
  await connectDB();
  return await Batch.find().lean();
}

/**
 * Get batch by ID
 */
export async function getBatchById(batchId: string) {
  await connectDB();
  if (!batchId) return null;
  return await Batch.findById(batchId).lean();
}

/**
 * Create a new batch
 */
export async function createBatch(data: any) {
  await connectDB();
  const batch = new Batch(data);
  return await batch.save();
}

/**
 * Update an existing batch
 */
export async function updateBatch(batchId: string, data: any) {
  await connectDB();
  return await Batch.findByIdAndUpdate(batchId, data, { new: true }).lean();
}

/**
 * Delete batch by ID
 */
export async function deleteBatch(batchId: string) {
  await connectDB();
  return await Batch.findByIdAndDelete(batchId);
}
