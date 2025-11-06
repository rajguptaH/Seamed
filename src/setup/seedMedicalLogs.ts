import * as dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { objectIds } from "./seedObjectIds.js";

dotenv.config({ path: ".env" });
const uri = "mongodb://localhost:27017/seamed";
const client = new MongoClient(uri);

const medicalLogs = [
  {
    shipId: objectIds.ships.seaExplorer,
    companyId: objectIds.companies.globalMaritimeGroup,
    date: new Date("2024-06-05T10:00:00Z"),
    crewMemberName: "John Doe",
    rank: "Deck Cadet",
    caseDescription: "Cut on hand",
    notes: "Minor injury during routine maintenance.",
    medicineUsedId: objectIds.other.sampleMedicine,
    quantityUsed: 1,
  },
  {
    shipId: objectIds.ships.oceanVoyager,
    companyId: objectIds.companies.oceanicShipping,
    date: new Date("2024-05-20T10:00:00Z"),
    crewMemberName: "Jane Smith",
    rank: "Chief Mate",
    caseDescription: "Seasickness",
    notes: "Resolved within 24 hours.",
    medicineUsedId: objectIds.other.sampleMedicine,
    quantityUsed: 2,
  },
];

async function seedMedicalLogs() {
  try {
    await client.connect();
    const db = client.db();
    await db.collection("medicallogs").deleteMany({});
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
