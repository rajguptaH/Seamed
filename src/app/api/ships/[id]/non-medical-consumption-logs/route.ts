import { connectDB } from '@/config/db';
import { getNonMedicalConsumptionLogsForShip } from '@/services/api/nonMedicalConsumptionService';
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
    const logs = await getNonMedicalConsumptionLogsForShip(shipId);
    return NextResponse.json(logs, { status: 200 });
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