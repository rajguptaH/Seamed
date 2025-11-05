import { Ship } from '../models/Ship';
import { IShip } from '../types';

export async function seedShips(companyMap: Record<string, string>) {
  const ships: IShip[] = [
    {
      id: 'ship1',
      name: 'The Sea Explorer',
      imo: '9876543',
      flag: 'Panama',
      crewCount: 25,
      companyId: companyMap['Global Maritime Group'],
      category: 'A',
    },
    {
      id: 'ship2',
      name: 'The Ocean Voyager',
      imo: '1234567',
      flag: 'Liberia',
      crewCount: 35,
      companyId: companyMap['Global Maritime Group'],
      category: 'B',
    },
    {
      id: 'ship3',
      name: 'The Pacific Drifter',
      imo: '7654321',
      flag: 'Marshall Islands',
      crewCount: 18,
      companyId: companyMap['Oceanic Shipping Co.'],
      category: 'C',
    },
  ];

  const docs = await Ship.insertMany(ships);
  console.log(`✅ Inserted ${docs.length} ships`);

  const map: Record<string, string> = {};
  docs.forEach(doc => (map[doc.name] = doc._id.toString()));
  return map;
}
