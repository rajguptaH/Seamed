import * as dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";

dotenv.config({ path: ".env" });

const uri = "mongodb://localhost:27017/seamed";
if (!uri) {
  throw new Error("MONGODB_URI is not defined in .env");
}

const client = new MongoClient(uri);

// Replace these ObjectIds with the actual _id values from your ships collection
const ships = {
seaExplorer: new ObjectId("64f1b2c6b3a1c1f234567892"),
oceanVoyager: new ObjectId("64f1b2c6b3a1c1f234567893"),
};

// Replace these with your actual medicine IDs
const medicines = {
acetylsalicylicAcid: "med1",
aciclovir: "med2",
};

const shipInventory = [
{
shipId: ships.seaExplorer,
medicineId: medicines.acetylsalicylicAcid,
medicineName: 'Acetylsalicylic acid',
medicineCategory: 'Uncategorized',
type: 'Medicine',
totalQuantity: 45,
requiredQuantity: 50,
batches: [
{
inventoryItemId: 'inv1',
quantity: 20,
batchNumber: 'A123',
expiryDate: new Date('2025-02-20T10:00:00Z'),
manufacturerName: 'Aspirin',
},
{
inventoryItemId: 'inv1',
quantity: 25,
batchNumber: 'B456',
expiryDate: new Date('2024-08-20T10:00:00Z'),
manufacturerName: 'Disprin',
},
],
},
{
shipId: ships.seaExplorer,
medicineId: medicines.aciclovir,
medicineName: 'Aciclovir',
medicineCategory: 'Uncategorized',
type: 'Medicine',
totalQuantity: 60,
requiredQuantity: 70,
batches: [
{
inventoryItemId: 'inv2',
quantity: 60,
batchNumber: 'C789',
expiryDate: new Date('2024-06-10T10:00:00Z'),
},
],
},
{
shipId: ships.seaExplorer,
medicineId: 'eq1',
medicineName: 'Portable oxygen set, complete',
medicineCategory: 'Resuscitation',
type: 'Equipment',
totalQuantity: 1,
requiredQuantity: 1,
batches: [
{
inventoryItemId: 'inv4',
quantity: 1,
batchNumber: null,
expiryDate: null,
},
],
},
{
shipId: ships.oceanVoyager,
medicineId: medicines.acetylsalicylicAcid,
medicineName: 'Acetylsalicylic acid',
medicineCategory: 'Uncategorized',
type: 'Medicine',
totalQuantity: 40,
requiredQuantity: 50,
batches: [
{
inventoryItemId: 'inv3',
quantity: 40,
batchNumber: 'D111',
expiryDate: new Date('2025-06-20T10:00:00Z'),
manufacturerName: 'Aspirin',
},
],
},
];

async function seedShipInventory() {
try {
await client.connect();
const db = client.db();
const result = await db.collection("inventoryItems").insertMany(shipInventory);
console.log(`✅ Inserted ${result.insertedCount} inventory items`);
} catch (err) {
console.error("❌ Seeding ship inventory failed:", err);
} finally {
await client.close();
process.exit(0);
}
}

seedShipInventory();
