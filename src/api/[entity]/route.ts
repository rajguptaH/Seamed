import { NextResponse } from "next/server";

import { connectDB } from "@/config/db";
import { Model } from "mongoose";

export function createCollectionRoute(model: Model<any>) {
  return async function GET(_: Request) {
    try {
      await connectDB();
      const data = await model.find().lean();
      return NextResponse.json(data, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
  };
}

export function createCollectionPost(model: Model<any>) {
  return async function POST(req: Request) {
    try {
      await connectDB();
      const body = await req.json();
      const created = await model.create(body);
      return NextResponse.json(created, { status: 201 });
    } catch (error: any) {
      console.error(error);
      if (error.code === 11000) {
        return NextResponse.json({ error: "Duplicate key error" }, { status: 409 });
      }
      return NextResponse.json({ error: "Failed to create" }, { status: 500 });
    }
  };
}
