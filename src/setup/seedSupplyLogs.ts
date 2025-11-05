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
pacificDrifter: new ObjectId("64f1b2c6b3a1c1f234567894"),
};

const supplyLogs = [
{
shipId: ships.seaExplorer,
date: new Date('2024-06-18T14:00:00Z'),
portOfSupply: 'Singapore',
supplierName: 'MediSupplies Inc.',
trackingNumber: 'MS123456789SG',
status: 'Delivered',
notes: 'Full order received.',
items: [],
},
{
shipId: ships.seaExplorer,
date: new Date('2024-07-10T09:00:00Z'),
portOfSupply: 'Rotterdam',
supplierName: 'Euro Pharma',
trackingNumber: 'EP987654321NL',
status: 'Shipped',
notes: 'Partial shipment. Remainder to follow.',
items: [],
},
];

async function seedSupplyLogs() {
try {
await client.connect();
const db = client.db();
const result = await db.collection("supplyLogs").insertMany(supplyLogs);
console.log(`✅ Inserted ${result.insertedCount} supply logs`);
} catch (err) {
console.error("❌ Seeding supply logs failed:", err);
} finally {
await client.close();
process.exit(0);
}
}

seedSupplyLogs();
