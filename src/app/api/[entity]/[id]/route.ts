import { connectDB } from "@/config/db";
import { Model } from "mongoose";
import { NextResponse } from "next/server";

// ✅ A reusable CRUD route generator for any Mongoose model
export function createEntityRoute(model: Model<any>) {
  return {
    // -------------------------------
    // GET /api/<entity>/:id
    // -------------------------------
    GET: async (_req: Request, context: { params: Promise<{ id: string }> }) => {
      try {
        const { id } = await context.params; // ✅ must await
        await connectDB();

        const doc = await model.findById(id).lean();
        if (!doc)
          return NextResponse.json({ error: "Not found" }, { status: 404 });

        return NextResponse.json(doc, { status: 200 });
      } catch (error) {
        console.error("GET error:", error);
        return NextResponse.json(
          { error: "Failed to fetch document" },
          { status: 500 }
        );
      }
    },

    // -------------------------------
    // PUT /api/<entity>/:id
    // -------------------------------
    PUT: async (req: Request, context: { params: Promise<{ id: string }> }) => {
      try {
        const { id } = await context.params;
        await connectDB();

        const body = await req.json();
        const updated = await model
          .findByIdAndUpdate(id, body, { new: true, runValidators: true })
          .lean();

        if (!updated)
          return NextResponse.json({ error: "Not found" }, { status: 404 });

        return NextResponse.json(updated, { status: 200 });
      } catch (error: any) {
        console.error("PUT error:", error);
        if (error.code === 11000)
          return NextResponse.json(
            { error: "Duplicate key error" },
            { status: 409 }
          );

        return NextResponse.json(
          { error: "Failed to update document" },
          { status: 500 }
        );
      }
    },

    // -------------------------------
    // DELETE /api/<entity>/:id
    // -------------------------------
    DELETE: async (_req: Request, context: { params: Promise<{ id: string }> }) => {
      try {
        const { id } = await context.params;
        await connectDB();

        const deleted = await model.findByIdAndDelete(id).lean();
        if (!deleted)
          return NextResponse.json({ error: "Not found" }, { status: 404 });

        return NextResponse.json(
          { message: "Deleted successfully" },
          { status: 200 }
        );
      } catch (error) {
        console.error("DELETE error:", error);
        return NextResponse.json(
          { error: "Failed to delete document" },
          { status: 500 }
        );
      }
    },
  };
}
