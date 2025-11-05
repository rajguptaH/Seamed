import { InventoryItem } from '../models/InventoryItem';
import { IInventoryItem } from '../types';

export async function seedShipInventory(
  shipMap: Record<string, string>,
  medicineMap: Record<string, string>
) {
  const shipInventory: Record<string, IInventoryItem[]> = {
    [shipMap['The Sea Explorer']]: [
      {
        id: 'inv1',
        shipId: shipMap['The Sea Explorer'],
        medicineId: medicineMap['Acetylsalicylic acid'],
        medicineName: 'Acetylsalicylic acid',
        medicineCategory: 'Uncategorized',
        type: 'Medicine',
        totalQuantity: 45,
        requiredQuantity: 50,
        batches: [
          {
            id: 'batch1',
            inventoryItemId: 'inv1',
            quantity: 20,
            batchNumber: 'A123',
            expiryDate: new Date('2025-02-20T10:00:00Z'),
            manufacturerName: 'Aspirin',
          },
          {
            id: 'batch2',
            inventoryItemId: 'inv1',
            quantity: 25,
            batchNumber: 'B456',
            expiryDate: new Date('2024-08-20T10:00:00Z'),
            manufacturerName: 'Disprin',
          },
        ],
      },
      {
        id: 'inv2',
        shipId: shipMap['The Sea Explorer'],
        medicineId: medicineMap['Aciclovir'],
        medicineName: 'Aciclovir',
        medicineCategory: 'Uncategorized',
        type: 'Medicine',
        totalQuantity: 60,
        requiredQuantity: 70,
        batches: [
          {
            id: 'batch3',
            inventoryItemId: 'inv2',
            quantity: 60,
            batchNumber: 'C789',
            expiryDate: new Date('2024-06-10T10:00:00Z'),
          },
        ],
      },
      {
        id: 'inv4',
        shipId: shipMap['The Sea Explorer'],
        medicineId: 'eq1',
        medicineName: 'Portable oxygen set, complete',
        medicineCategory: 'Resuscitation',
        type: 'Equipment',
        totalQuantity: 1,
        requiredQuantity: 1,
        batches: [
          {
            id: 'batch5',
            inventoryItemId: 'inv4',
            quantity: 1,
            batchNumber: null,
            expiryDate: null,
          },
        ],
      },
    ],

    [shipMap['The Ocean Voyager']]: [
      {
        id: 'inv3',
        shipId: shipMap['The Ocean Voyager'],
        medicineId: medicineMap['Acetylsalicylic acid'],
        medicineName: 'Acetylsalicylic acid',
        medicineCategory: 'Uncategorized',
        type: 'Medicine',
        totalQuantity: 40,
        requiredQuantity: 50,
        batches: [
          {
            id: 'batch4',
            inventoryItemId: 'inv3',
            quantity: 40,
            batchNumber: 'D111',
            expiryDate: new Date('2025-06-20T10:00:00Z'),
            manufacturerName: 'Aspirin',
          },
        ],
      },
    ],
  };

  // Flatten inventory from all ships into a single array
  const allItems = Object.values(shipInventory).flat();

  // Insert into MongoDB
  const docs = await InventoryItem.insertMany(allItems);
  console.log(`✅ Inserted ${docs.length} inventory items`);
}
