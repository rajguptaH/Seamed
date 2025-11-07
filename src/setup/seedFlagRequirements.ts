
import * as dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config({ path: ".env" });

const uri = "mongodb://localhost:27017/seamed";
if (!uri) {
  throw new Error("MONGODB_URI is not defined in .env");
}

const client = new MongoClient(uri);

async function seedFlagRequirements() {
try {
await client.connect();
const db = client.db();


// Fetch all medicines/equipment
const allItems = await db.collection("medicines").find().toArray();

if (allItems.length === 0) {
  console.error("❌ No medicines/equipment found. Please seed medicines first.");
  return;
}

const flags = [
  'Panama', 'Liberia', 'Marshall Islands', 'Hong Kong', 'Singapore', 'India', 'Cayman Islands'
];

// Default requirements template
const defaultRequirements: Partial<any>[] = [
     { categoryA: '50', categoryB: '50', categoryC: '-' },
    { categoryA: '70+', categoryB: '35+', categoryC: '-' },
    { categoryA: '10+', categoryB: '5+', categoryC: '5+' },
    { categoryA: '20', categoryB: '10', categoryC: '-' },
    { categoryA: '12+', categoryB: '12+', categoryC: '-' },
    { categoryA: '24+', categoryB: '24+', categoryC: '-' },
    { categoryA: '10+', categoryB: '5+', categoryC: '-' },
    { categoryA: '10+', categoryB: '5+', categoryC: '-' },
    { categoryA: '15', categoryB: '5+', categoryC: '-' },
    { categoryA: '30+', categoryB: '30+', categoryC: '-' },
    { categoryA: '120g+', categoryB: '120g+', categoryC: '-' },
    { categoryA: '20+', categoryB: '10+', categoryC: '-' },
    { categoryA: '10ml', categoryB: '10ml+', categoryC: '-' },
    { categoryA: '3', categoryB: '1', categoryC: '-' },
    { categoryA: '50+', categoryB: '20+', categoryC: '-' },
    { categoryA: '30+', categoryB: '-', categoryC: '-' },
    { categoryA: '10', categoryB: '-', categoryC: '-' },
    { categoryA: '500ml', categoryB: '500ml+', categoryC: '100ml+' },
    { categoryA: '500ml', categoryB: '100ml', categoryC: '-' },
    { categoryA: '20+', categoryB: '20+', categoryC: '-' },
    { categoryA: '5+', categoryB: '5+', categoryC: '-' },
    { categoryA: '1+', categoryB: '1+', categoryC: '-' },
    { categoryA: '5', categoryB: '5+', categoryC: '-' },
    { categoryA: '2x30g', categoryB: '1x30g', categoryC: '-' },
    { categoryA: '100', categoryB: '50', categoryC: '50+' },
    { categoryA: '10', categoryB: '10', categoryC: '5+' },
    { categoryA: '5', categoryB: '5', categoryC: '-' },
    { categoryA: '30', categoryB: '30', categoryC: '10+' },
    { categoryA: '6+', categoryB: '6+', categoryC: '-' },
    { categoryA: '60+', categoryB: '-', categoryC: '-' },
    { categoryA: '30+', categoryB: '20+', categoryC: '-' },
    { categoryA: '2x30g', categoryB: '1x30g', categoryC: '-' },
    { categoryA: '10+', categoryB: '5+', categoryC: '-' },
    { categoryA: '3+', categoryB: '3+', categoryC: '-' },
    { categoryA: '10', categoryB: '10', categoryC: '-' },
    { categoryA: '100ml+', categoryB: '100ml+', categoryC: '-' },
    { categoryA: '10+', categoryB: '5+', categoryC: '-' },
    { categoryA: '30+', categoryB: '30+', categoryC: '-' },
    { categoryA: '10', categoryB: '10', categoryC: '10+' },
    { categoryA: '15l(75)', categoryB: '10l(50)', categoryC: '2l(10)+' },
    { categoryA: '2', categoryB: '1', categoryC: '-' },
    { categoryA: '100', categoryB: '50', categoryC: '25' },
    { categoryA: '200ml+', categoryB: '100ml+', categoryC: '-' },
    { categoryA: '300ml+', categoryB: '100ml+', categoryC: '-' },
    { categoryA: '100ml', categoryB: '100ml', categoryC: '100ml+' },
    { categoryA: '1x25g', categoryB: '1x25g', categoryC: '-' },
    { categoryA: '30+', categoryB: '30+', categoryC: '-' },
    { categoryA: '1', categoryB: '1', categoryC: '-' },
    { categoryA: '5+', categoryB: '1', categoryC: '-' },
    { categoryA: '20+', categoryB: '20+', categoryC: '-' },
    { categoryA: '2', categoryB: '1', categoryC: '1+' },
    { categoryA: '2+', categoryB: '2+', categoryC: '-' },
    { categoryA: '15', categoryB: '5+', categoryC: '-' },
    { categoryA: '56+', categoryB: '56+', categoryC: '-' },
    { categoryA: '200g+', categoryB: '100g+', categoryC: '100g+' },
    // Equipment
    { quantity: '1' }, { quantity: '2' }, { quantity: '1' }, { quantity: '1' },
    { quantity: '1' }, { quantity: '200' }, { quantity: '3' }, { quantity: '100' },
    { quantity: '100' }, { quantity: '1' }, { quantity: '100' }, { quantity: '50' },
    { quantity: '3' }, { quantity: '5' }, { quantity: '1' }, { quantity: '10' },
    { quantity: '5' }, { quantity: '1' }, { quantity: '1' }, { quantity: '10' },
    { quantity: '100' }, { quantity: '50' }, { quantity: '20' }, { quantity: '2' },
    { quantity: '10' }, { quantity: '50' }, { quantity: '9' }, { quantity: '20' },
    { quantity: '1' }, { quantity: '1' }, { quantity: '1' }, { quantity: '3' },
    { quantity: '1' }, { quantity: '1' }, { quantity: '3' }, { quantity: '50' },
    { quantity: '100' }, { quantity: '100' }, { quantity: '100' }, { quantity: '1' },
    { quantity: '1' }, { quantity: '1' }, { quantity: '1' }, { quantity: '1' },
    { quantity: '1' }, { quantity: '1' }, { quantity: '1' }, { quantity: '50' },
    { quantity: '50' }, { quantity: '20' }, { quantity: '20' }, { quantity: '20' },
    { quantity: '10' }, { quantity: '3' }, { quantity: '1' }, { quantity: '2' },
    { quantity: '2' }, { quantity: '2' }, { quantity: '2' }, { quantity: '20' },
    { quantity: '2' }, { quantity: '10' }, { quantity: '1' }, { quantity: '50' },
    { quantity: '1' }, { quantity: '2' }, { quantity: '1' }, { quantity: '1' },
    { quantity: '1' }, { quantity: '1' }, { quantity: '1' }, { quantity: '100' },
    { quantity: '1' }, { quantity: '3' }, { quantity: '1' }, { quantity: '20' },
    { quantity: '3' }, { quantity: '10' }, { quantity: '12' }, { quantity: '1' },
    { quantity: '10' }, { quantity: '200' }, { quantity: '1' }, { quantity: '1' },
];

// Merge items with requirements
const mergedRequirements = allItems.map((item, idx) => ({
  medicineId: item._id.toString(),
  ...(defaultRequirements[idx] || { categoryA: '-', categoryB: '-', categoryC: '-', quantity: '1' }),
}));

// Expand for all flags
const allFlagRequirements = flags.flatMap(flag =>
  mergedRequirements.map(req => ({
    ...req,
    flag,
  }))
);

// Clean previous data
await db.collection("flagrequirements").deleteMany({});
const result = await db.collection("flagrequirements").insertMany(allFlagRequirements);

console.log(`✅ Inserted ${result.insertedCount} flag requirements across ${flags.length} flags`);

} catch (err) {
console.error("❌ Seeding flag requirements failed:", err);
} finally {
await client.close();
process.exit(0);
}
}

seedFlagRequirements();
