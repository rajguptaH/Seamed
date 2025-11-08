
import { connectDB } from "@/config/db";
import { Ship } from "@/models/Ship";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const ships = await Ship.find().lean();
    console.log("Ships fetched from DB:", ships);
    return NextResponse.json(ships, { status: 200 });
  } catch (error) {
    console.error("Error fetching ships:", error);
    return NextResponse.json({ error: "Failed to fetch ships" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const requiredFields = ["name", "imo", "flag", "crewCount", "companyId", "category"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }
   const existingShip = await Ship.findOne({ imo: body.imo });
    if (existingShip) {
      return NextResponse.json({ error: "IMO already exists" }, { status: 409 });
    }

    const newShip = await Ship.create(body);
    return NextResponse.json(newShip, { status: 201 });
  } catch (error: any) {
    console.error("Error creating ship:", error);
    if (error.code === 11000) {
      return NextResponse.json({ error: "IMO already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create ship" }, { status: 500 });
  }
}
