import { connectDB } from '@/config/db';
import { Batch } from '@/models/Batch';
import { MedicalLog } from '@/models/MedicalLog';
import { NextResponse } from 'next/server';

/**
 * GET /api/ships/:id/medical-logs
 * Fetches all medical logs for a given ship with batch details.
 */
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    // ✅ Ensure DB connection
    await connectDB();

    const { id: shipId } = params;
    if (!shipId) {
      return NextResponse.json({ message: 'Ship ID is required' }, { status: 400 });
    }

    // ✅ Fetch logs for this ship (awaited)
    const logs = await MedicalLog.find({ shipId }).lean().exec();

    // ✅ Populate batch details (fully awaited within Promise.all)
    const detailedLogs = await Promise.all(
      logs.map(async (log) => {
        const batch = await Batch.findById(log.batchUsedId).lean().exec();
        return {
          ...log,
          batchNumber: batch?.batchNumber ?? 'N/A',
          expiryDate: batch?.expiryDate ?? null,
        };
      })
    );

    // ✅ Sort logs by date descending (latest first)
    detailedLogs.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return NextResponse.json(detailedLogs, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching medical logs:', error);
    return NextResponse.json(
      {
        message: 'Failed to fetch medical logs',
        error: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}
