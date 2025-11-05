import * as dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";

dotenv.config({ path: ".env" });

const uri = "mongodb://localhost:27017/seamed";
if (!uri) {
  throw new Error("MONGODB_URI is not defined in .env");
}


const client = new MongoClient(uri);

// Replace these ObjectIds with the actual _id values from your companies collection
const companyMap = {
globalMaritimeGroup: new ObjectId("64f1b2c6b3a1c1f234567890"),
oceanicShippingCo: new ObjectId("64f1b2c6b3a1c1f234567891"),
};

const ships = [
{
name: 'The Sea Explorer',
imo: '9876543',
flag: 'Panama',
crewCount: 25,
companyId: companyMap.globalMaritimeGroup,
category: 'A',
},
{
name: 'The Ocean Voyager',
imo: '1234567',
flag: 'Liberia',
crewCount: 35,
companyId: companyMap.globalMaritimeGroup,
category: 'B',
},
{
name: 'The Pacific Drifter',
imo: '7654321',
flag: 'Marshall Islands',
crewCount: 18,
companyId: companyMap.oceanicShippingCo,
category: 'C',
},
];

async function seedShips() {
try {
await client.connect();
const db = client.db();
const result = await db.collection("ships").insertMany(ships);
console.log(`✅ Inserted ${result.insertedCount} ships`);
} catch (err) {
console.error("❌ Seeding ships failed:", err);
} finally {
await client.close();
process.exit(0);
}
}

seedShips();
