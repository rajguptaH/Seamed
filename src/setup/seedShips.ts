// seeds/seedShips.ts
import * as dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { objectIds } from "./seedObjectIds.js";

dotenv.config({ path: ".env" });
const uri = "mongodb://localhost:27017/seamed";
const client = new MongoClient(uri);

const ships = [
  {
    _id: objectIds.ships.seaExplorer,
    name: "The Sea Explorer",
    imo: "9876543",
    flag: "Panama",
    crewCount: 25,
    companyId: objectIds.companies.globalMaritimeGroup,
    category: "A",
  },
  {
    _id: objectIds.ships.oceanVoyager,
    name: "The Ocean Voyager",
    imo: "1234567",
    flag: "Liberia",
    crewCount: 35,
    companyId: objectIds.companies.globalMaritimeGroup,
    category: "B",
  },
  {
    _id: objectIds.ships.pacificDrifter,
    name: "The Pacific Drifter",
    imo: "7654321",
    flag: "Marshall Islands",
    crewCount: 18,
    companyId: objectIds.companies.oceanicShipping,
    category: "C",
  },
];

async function seedShips() {
  try {
    await client.connect();
    const db = client.db();
    await db.collection("ships").deleteMany({});
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
