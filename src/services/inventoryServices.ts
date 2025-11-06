import { connectDB } from "@/config/db";
import { FlagRequirement } from "@/models/FlagRequirement";
import { InventoryItem } from "@/models/InventoryItem";
import { Medicine } from "@/models/Medicine";
import { Ship } from "@/models/Ship";
import { IInventoryItem } from "@/types";
/**
 * Builds a detailed inventory list for a given ship using MongoDB.
 * - Fetches the ship, flag requirements, and all medicines.
 * - Computes required quantities.
 * - Ensures inventory records exist for every medicine.
 */
export async function getInventoryForShip(shipId: string): Promise<IInventoryItem[]> {
  await connectDB();

  // 1️⃣ Find the ship
const ship = await Ship.findById(shipId); 

  if (!ship) {
    throw new Error("Ship not found");
  }

  // 2️⃣ Get all medicines and flag requirements
  const [medicines, flagReqs] = await Promise.all([
    Medicine.find(),
    FlagRequirement.find().lean(),
  ]);

  // Filter flag requirements by ship’s flag (if you store by flag)
  // e.g. If you have `flag` field in FlagRequirement, add this line:
  // const flagReqs = await FlagRequirement.find({ flag: ship.flag }).lean();

  // 3️⃣ Get existing inventory for this ship
  const shipInv = await InventoryItem.find({ shipId: ship._id }).populate("batches").lean();

  // 4️⃣ Build detailed inventory list
  const detailedInventory: IInventoryItem[] = [];

  for (const med of medicines) {
    const existingItem = shipInv.find((i) => i.medicineId.toString() === med._id.toString());
    const requirement = flagReqs.find((req) => req.medicineId.toString() === med._id.toString());

    let requiredQuantity = 0;

    if (requirement) {
      let baseQtyStr: string | undefined;

      if (med.type === "Medicine") {
        const catKey = `category${ship.category}` as keyof typeof requirement;
        baseQtyStr = requirement[catKey] as string;
      } else {
        baseQtyStr = requirement.quantity ?? undefined;
      }

      if (baseQtyStr && baseQtyStr !== "-") {
        const baseQty = parseInt(baseQtyStr.replace(/[^0-9]/g, ""), 10) || 0;

        if (med.type === "Medicine") {
          const crewMultiplier = Math.ceil(ship.crewCount / 10);
          requiredQuantity = baseQty * crewMultiplier;
        } else {
          requiredQuantity = baseQty;
        }

        if (med.notes?.includes("double if crew size > 30") && ship.crewCount > 30) {
          requiredQuantity *= 2;
        }

        if (med.notes?.includes("per patient")) {
          requiredQuantity *= ship.crewCount;
        }
      }
    }

    if (existingItem) {
      // ✅ Update total quantity (sum of all batches)
      const totalQty = Array.isArray(existingItem.batches)
        ? existingItem.batches.reduce((sum, b: any) => sum + (b.quantity || 0), 0)
        : 0;

      detailedInventory.push({
        ...existingItem,
        medicineName: med.name,
        medicineCategory: med.category || "Uncategorized",
        type: med.type,
        requiredQuantity,
        totalQuantity: totalQty,
      });
    } else {
      // 🆕 Create new inventory entry if missing
      const newItem = await InventoryItem.create({
        shipId: ship._id,
        medicineId: med._id,
        medicineName: med.name,
        medicineCategory: med.category || "Uncategorized",
        type: med.type,
        requiredQuantity,
        totalQuantity: 0,
        batches: [],
      });

      detailedInventory.push(newItem.toObject());
    }
  }

  return detailedInventory;
}
