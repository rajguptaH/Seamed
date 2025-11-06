// seeds/seedSupplyLogs.ts
import * as dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { objectIds } from "./seedObjectIds.js";

dotenv.config({ path: ".env" });
const uri = "mongodb://localhost:27017/seamed";
const client = new MongoClient(uri);

const supplyLogs = [
  {
    shipId: objectIds.ships.seaExplorer,
    date: new Date("2024-06-18T14:00:00Z"),
    portOfSupply: "Singapore",
    supplierName: "MediSupplies Inc.",
    trackingNumber: "MS123456789SG",
    status: "Delivered",
    notes: "Full order received.",
    items: [],
  },
  {
    shipId: objectIds.ships.oceanVoyager,
    date: new Date("2024-07-10T09:00:00Z"),
    portOfSupply: "Rotterdam",
    supplierName: "Euro Pharma",
    trackingNumber: "EP987654321NL",
    status: "Shipped",
    notes: "Partial shipment. Remainder to follow.",
    items: [],
  },
];

async function seedSupplyLogs() {
  try {
    await client.connect();
    const db = client.db();
    await db.collection("supplyLogs").deleteMany({});
    const result = await db.collection("supplylogs").insertMany(supplyLogs);
    console.log(`✅ Inserted ${result.insertedCount} supply logs`);
  } catch (err) {
    console.error("❌ Seeding supply logs failed:", err);
  } finally {
    await client.close();
    process.exit(0);
  }
}

seedSupplyLogs();
