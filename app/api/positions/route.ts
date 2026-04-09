import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import StakePosition from "@/lib/models/StakePosition";

export async function GET(req: Request) {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const userId = (session.user as any).id;
    const role = (session.user as any).role;

    let query = {};
    if (role === 'staker') {
      query = { stakerId: userId };
    }

    const positions = await StakePosition.find(query).sort({ stakedAt: -1 });

    let totalStaked = 0;
    let totalYield = 0;

    const positionsWithYield = positions.map(p => {
      const pos = p.toObject();
      if (pos.status === 'active') {
        const now = new Date();
        const stakedAt = new Date(pos.stakedAt);
        const timeDiff = now.getTime() - stakedAt.getTime();
        const daysElapsed = Math.min(pos.lockPeriodDays, timeDiff / (1000 * 60 * 60 * 24));
        pos.currentYield = Number((pos.amountXLM * pos.apyRate * (daysElapsed / 365)).toFixed(4));
        totalStaked += pos.amountXLM;
        totalYield += pos.currentYield;
      } else {
        totalYield += pos.yieldEarned || 0;
      }
      return pos;
    });

    return NextResponse.json({ 
      positions: positionsWithYield, 
      totalStaked: Number(totalStaked.toFixed(2)), 
      totalYield: Number(totalYield.toFixed(4)) 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
