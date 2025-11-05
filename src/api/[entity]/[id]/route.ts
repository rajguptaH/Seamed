import { connectDB } from "@/config/db";
import { Model } from "mongoose";
import { NextResponse } from "next/server";
export function createEntityRoute(model: Model<any>) {
  return {
    GET: async (_: Request, { params }: { params: { id: string } }) => {
      try {
        await connectDB();
        const doc = await model.findById(params.id).lean();
        if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json(doc, { status: 200 });
      } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
      }
    },
    PUT: async (req: Request, { params }: { params: { id: string } }) => {
      try {
        await connectDB();
        const body = await req.json();
        const updated = await model.findByIdAndUpdate(params.id, body, { new: true, runValidators: true }).lean();
        if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json(updated, { status: 200 });
      } catch (error: any) {
        console.error(error);
        if (error.code === 11000) return NextResponse.json({ error: "Duplicate key" }, { status: 409 });
        return NextResponse.json({ error: "Failed to update" }, { status: 500 });
      }
    },
    DELETE: async (_: Request, { params }: { params: { id: string } }) => {
      try {
        await connectDB();
        const deleted = await model.findByIdAndDelete(params.id).lean();
        if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
      } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
      }
    },
  };
}
