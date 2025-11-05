import { SupplyLog } from '../models/SupplyLog';
import { ISupplyLog } from '../types';

export async function seedSupplyLogs(shipMap: Record<string, string>) {
  const supplyLogs: ISupplyLog[] = [
    {

      shipId: shipMap['The Sea Explorer'],
      date: new Date('2024-06-18T14:00:00Z'),
      portOfSupply: 'Singapore',
      supplierName: 'MediSupplies Inc.',
      trackingNumber: 'MS123456789SG',
      status: 'Delivered',
      notes: 'Full order received.',
      items: [],
    },
    {

      shipId: shipMap['The Sea Explorer'],
      date: new Date('2024-07-10T09:00:00Z'),
      portOfSupply: 'Rotterdam',
      supplierName: 'Euro Pharma',
      trackingNumber: 'EP987654321NL',
      status: 'Shipped',
      notes: 'Partial shipment. Remainder to follow.',
      items: [],
    },
  ];

  const docs = await SupplyLog.insertMany(supplyLogs);
  console.log(`✅ Inserted ${docs.length} supply logs`);
}
