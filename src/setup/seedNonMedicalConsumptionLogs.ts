import { NonMedicalConsumptionLog } from '../models/NonMedicineConsumptionLog';
import { INonMedicalConsumptionLog } from '../types';

export async function seedNonMedicalConsumptionLogs(shipMap: Record<string, string>) {
  const nonMedicalConsumptionLogs: INonMedicalConsumptionLog[] = [
    {
      id: 'nmlog1',
      shipId: shipMap['The Sea Explorer'],
      date: new Date('2024-06-15T10:00:00Z'),
      medicineId: 'med2',
      batchId: 'batch3',
      quantity: 10,
      reason: 'Damaged',
      notes: 'Water damage in storage.',
    },
  ];

  const docs = await NonMedicalConsumptionLog.insertMany(nonMedicalConsumptionLogs);
  console.log(`✅ Inserted ${docs.length} non-medical consumption logs`);
}
