import { connectDB } from "@/config/db";
import { SupplyLog } from "@/models/SupplyLog";


/**
 * Get all supply logs for a specific ship
 */
export async function getSupplyLogsForShip(shipId: string) {
  await connectDB();
  if (!shipId) return [];

  const logs = await SupplyLog.find({ shipId }).sort({ date: -1 }).lean();
  return logs;
}

/**
 * Create a new supply log entry
 */
export async function createSupplyLog(data: any) {
  await connectDB();
  const log = new SupplyLog(data);
  return await log.save();
}

/**
 * Delete a specific supply log
 */
export async function deleteSupplyLog(id: string) {
  await connectDB();
  return await SupplyLog.findByIdAndDelete(id);
}
