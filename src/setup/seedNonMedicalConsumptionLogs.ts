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

const nonMedicalConsumptionLogs = [
{
shipId: ships.seaExplorer,
date: new Date('2024-06-15T10:00:00Z'),
medicineId: 'med2',
batchId: 'batch3',
quantity: 10,
reason: 'Damaged',
notes: 'Water damage in storage.',
},
];

async function seedNonMedicalConsumptionLogs() {
try {
await client.connect();
const db = client.db();
const result = await db.collection("nonMedicalConsumptionLogs").insertMany(nonMedicalConsumptionLogs);
console.log(`✅ Inserted ${result.insertedCount} non-medical consumption logs`);
} catch (err) {
console.error("❌ Seeding non-medical consumption logs failed:", err);
} finally {
await client.close();
process.exit(0);
}
}

seedNonMedicalConsumptionLogs();
