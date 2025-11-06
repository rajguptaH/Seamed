import { connectDB } from "@/config/db";
import { NonMedicalConsumptionLog } from "@/models/NonMedicineConsumptionLog";
import { getBatchById } from "@/services/api/batchService";
import { getMedicines } from "@/services/api/medicineService";

export async function getNonMedicalConsumptionLogsForShip(shipId: string) {
  await connectDB();

  const logs = await NonMedicalConsumptionLog.find({ shipId }).lean();

  const detailedLogs = await Promise.all(
    logs.map(async (log) => {
      const medicines = await getMedicines();
      const medicine = medicines.find((m) => m._id.toString() === log.medicineId.toString());
      const batch = await getBatchById(log.batchId);

      return {
        ...log,
        medicineName: medicine?.name || "Unknown",
        batchNumber: batch?.batchNumber || "N/A",
      };
    })
  );

  return detailedLogs.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}
