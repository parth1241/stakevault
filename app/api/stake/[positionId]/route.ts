import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import StakePosition from "@/lib/models/StakePosition";

export async function GET(
  req: Request,
  { params }: { params: { positionId: string } }
) {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const position = await StakePosition.findById(params.positionId);

    if (!position) return NextResponse.json({ error: "Position not found" }, { status: 404 });

    // Verify ownership or check if admin
    const userId = (session.user as any).id;
    const role = (session.user as any).role;
    if (position.stakerId.toString() !== userId && role !== 'admin') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Calculate current yield
    const now = new Date();
    const stakedAt = new Date(position.stakedAt);
    const timeDiff = now.getTime() - stakedAt.getTime();
    const daysElapsed = Math.min(position.lockPeriodDays, timeDiff / (1000 * 60 * 60 * 24));
    
    // yield = amount * apy * (days/365)
    const currentYield = position.amountXLM * position.apyRate * (daysElapsed / 365);

    return NextResponse.json({ 
      ...position.toObject(),
      currentYield: Number(currentYield.toFixed(4)),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
