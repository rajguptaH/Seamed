import { connectDB } from "@/config/db";
import { Ship } from "@/models/Ship";
import { NextResponse } from "next/server";
export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const ship = await Ship.findById(params.id).lean();
    if (!ship) return NextResponse.json({ error: "Ship not found" }, { status: 404 });
    return NextResponse.json(ship, { status: 200 });
  } catch (error) {
    console.error("Error fetching ship:", error);
    return NextResponse.json({ error: "Failed to fetch ship" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await req.json();
    const updated = await Ship.findByIdAndUpdate(params.id, body, { new: true, runValidators: true }).lean();
    if (!updated) return NextResponse.json({ error: "Ship not found" }, { status: 404 });
    return NextResponse.json(updated, { status: 200 });
  } catch (error: any) {
    console.error("Error updating ship:", error);
    if (error.code === 11000) {
      return NextResponse.json({ error: "IMO already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to update ship" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const deleted = await Ship.findByIdAndDelete(params.id).lean();
    if (!deleted) return NextResponse.json({ error: "Ship not found" }, { status: 404 });
    return NextResponse.json({ message: "Ship deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting ship:", error);
    return NextResponse.json({ error: "Failed to delete ship" }, { status: 500 });
  }
}
