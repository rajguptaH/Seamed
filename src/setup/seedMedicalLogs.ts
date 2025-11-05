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

const medicalLogs = [
{
shipId: ships.seaExplorer,
date: new Date('2024-06-05T10:00:00Z'),
crewMemberName: 'John Doe',
rank: 'Deck Cadet',
caseDescription: 'Cut on hand',
notes: 'Minor injury during routine maintenance.',
medicineUsedId: 'inv1',
batchUsedId: 'batch2',
quantityUsed: 1,
photoUrl: '[https://picsum.photos/seed/medlog1/600/400](https://picsum.photos/seed/medlog1/600/400)',
},
{
shipId: ships.seaExplorer,
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

async function seedMedicalLogs() {
try {
await client.connect();
const db = client.db();
const result = await db.collection("medicalLogs").insertMany(medicalLogs);
console.log(`✅ Inserted ${result.insertedCount} medical logs`);
} catch (err) {
console.error("❌ Seeding medical logs failed:", err);
} finally {
await client.close();
process.exit(0);
}
}

seedMedicalLogs();
