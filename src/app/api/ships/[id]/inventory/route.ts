import { getInventoryForShip } from "@/services/api/inventoryServices";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
   context: { params: Promise<{ id: string }> }
) {

  try {
      const { id } = await context.params;
    const inventory = await getInventoryForShip(id);
    return NextResponse.json(inventory);
  } catch (error: any) {
    console.error("Inventory error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch inventory" },
      { status: 500 }
    );
  }
}
