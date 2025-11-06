import { createSupplyLog, getSupplyLogsForShip } from "@/services/api/supplyLogService";
import { NextResponse } from "next/server";

// ✅ GET: /api/ships/[id]/supply-logs
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const logs = await getSupplyLogsForShip(params.id);
    return NextResponse.json(logs, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching supply logs:", error);
    return NextResponse.json(
      { message: "Failed to fetch supply logs", error: error.message },
      { status: 500 }
    );
  }
}

// ✅ POST: /api/ships/[id]/supply-logs
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const newLog = await createSupplyLog({ ...data, shipId: params.id });
    return NextResponse.json(newLog, { status: 201 });
  } catch (error: any) {
    console.error("Error creating supply log:", error);
    return NextResponse.json(
      { message: "Failed to create supply log", error: error.message },
      { status: 500 }
    );
  }
}
