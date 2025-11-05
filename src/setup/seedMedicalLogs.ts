import { MedicalLog } from '../models/MedicalLog';
import { IMedicalLog } from '../types';

export async function seedMedicalLogs(shipMap: Record<string, string>) {
  const medicalLogs: IMedicalLog[] = [
    {
         shipId: shipMap['The Sea Explorer'],
      date: new Date('2024-06-05T10:00:00Z'),
      crewMemberName: 'John Doe',
      rank: 'Deck Cadet',
      caseDescription: 'Cut on hand',
      notes: 'Minor injury during routine maintenance.',
      medicineUsedId: 'inv1',
      batchUsedId: 'batch2',
      quantityUsed: 1,
      photoUrl: 'https://picsum.photos/seed/medlog1/600/400',
    },
    {
         shipId: shipMap['The Sea Explorer'],
      date: new Date('2024-05-20T10:00:00Z'),
      crewMemberName: 'Jane Smith',
      rank: 'Chief Mate',
      caseDescription: 'Seasickness',
      notes: 'Resolved within 24 hours.',
      medicineUsedId: 'med39',
      batchUsedId: 'batch_placeholder',
      quantityUsed: 2,
      photoUrl: null,
    },
  ];

  const docs = await MedicalLog.insertMany(medicalLogs);
  console.log(`✅ Inserted ${docs.length} medical logs`);
}
