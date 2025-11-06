import * as dotenv from "dotenv";
import mongoose from "mongoose";
import { objectIds } from "./seedObjectIds.js";
import { InventoryItem } from "../models/InventoryItem.js";
import { Batch } from "../models/Batch.js";

dotenv.config({ path: ".env" });

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/seamed";

// --- Data ---
const inventoryData = [
  {
    shipId: objectIds.ships.seaExplorer,
    medicineId: objectIds.other.sampleMedicine,
    medicineName: "Acetylsalicylic acid",
    medicineCategory: "Uncategorized",
    type: "Medicine",
    totalQuantity: 45,
    requiredQuantity: 50,
    batches: [
      {
        quantity: 20,
        batchNumber: "A123",
        expiryDate: new Date("2025-02-20T10:00:00Z"),
        manufacturerName: "Aspirin",
      },
      {
        quantity: 25,
        batchNumber: "B456",
        expiryDate: new Date("2024-08-20T10:00:00Z"),
        manufacturerName: "Disprin",
      },
    ],
  },
  {
    shipId: objectIds.ships.oceanVoyager,
    medicineId: objectIds.other.sampleMedicine,
    medicineName: "Aciclovir",
    medicineCategory: "Uncategorized",
    type: "Medicine",
    totalQuantity: 60,
    requiredQuantity: 70,
    batches: [
      {
        quantity: 60,
        batchNumber: "C789",
        expiryDate: new Date("2024-06-10T10:00:00Z"),
        manufacturerName: "Herpex Labs",
      },
    ],
  },
  {
    shipId: objectIds.ships.pacificDrifter,
    medicineId: objectIds.other.sampleMedicine,
    medicineName: "Portable oxygen set, complete",
    medicineCategory: "Resuscitation",
    type: "Equipment",
    totalQuantity: 1,
    requiredQuantity: 1,
    batches: [
      {
        quantity: 1,
        batchNumber: null,
        expiryDate: null,
        manufacturerName: "SafeBreath Co.",
      },
    ],
  },
];

async function seedInventory() {
  try {
    console.log("🚀 Connecting to MongoDB...");
    await mongoose.connect(uri);

    console.log("🧹 Clearing old data...");
    await Batch.deleteMany({});
    await InventoryItem.deleteMany({});

    for (const item of inventoryData) {
      // Create InventoryItem first
      const inventoryItem = await InventoryItem.create({
        shipId: item.shipId,
        medicineId: item.medicineId,
        medicineName: item.medicineName,
        medicineCategory: item.medicineCategory,
        type: item.type,
        totalQuantity: item.totalQuantity,
        requiredQuantity: item.requiredQuantity,
        batches: [], // temporarily empty
      });

      // Create batches referencing this item
      const batchDocs = await Batch.insertMany(
        item.batches.map((b) => ({
          inventoryItemId: inventoryItem._id,
          quantity: b.quantity,
          batchNumber: b.batchNumber,
          expiryDate: b.expiryDate,
          manufacturerName: b.manufacturerName,
        }))
      );

      // Update inventory item with batch IDs
      inventoryItem.batches = batchDocs.map((b) => b._id);
      await inventoryItem.save();

      console.log(`✅ Inserted ${item.medicineName} with ${batchDocs.length} batches`);
    }

    console.log("🎉 Ship inventory seeding complete!");
  } catch (err) {
    console.error("❌ Seeding failed:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedInventory();
