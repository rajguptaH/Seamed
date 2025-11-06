import { connectDB } from "@/config/db";
import { Medicine } from "@/models/Medicine";


/**
 * Get all medicines
 */
export async function getMedicines() {
  await connectDB();
  return await Medicine.find().lean();
}

/**
 * Get medicine by ID
 */
export async function getMedicineById(medicineId: string) {
  await connectDB();
  if (!medicineId) return null;
  return await Medicine.findById(medicineId).lean();
}

/**
 * Create a new medicine
 */
export async function createMedicine(data: any) {
  await connectDB();
  const medicine = new Medicine(data);
  return await medicine.save();
}

/**
 * Update an existing medicine
 */
export async function updateMedicine(medicineId: string, data: any) {
  await connectDB();
  return await Medicine.findByIdAndUpdate(medicineId, data, { new: true }).lean();
}

/**
 * Delete medicine by ID
 */
export async function deleteMedicine(medicineId: string) {
  await connectDB();
  return await Medicine.findByIdAndDelete(medicineId);
}
