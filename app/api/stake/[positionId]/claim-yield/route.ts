import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import StakePosition from "@/lib/models/StakePosition";
import User from "@/lib/models/User";

export async function POST(
  req: Request,
  { params }: { params: { positionId: string } }
) {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const position = await StakePosition.findById(params.positionId);

    if (!position || position.status !== 'active') {
      return NextResponse.json({ error: "Active position not found" }, { status: 404 });
    }

    const lastClaim = new Date(position.lastYieldClaim || position.stakedAt);
    const now = new Date();
    const timeDiff = now.getTime() - lastClaim.getTime();
    const daysElapsed = timeDiff / (1000 * 60 * 60 * 24);
    
    // Accrued since last claim
    const yieldClaimed = position.amountXLM * position.apyRate * (daysElapsed / 365);

    if (yieldClaimed < 0.0001) {
      return NextResponse.json({ error: "Insufficient yield to claim" }, { status: 400 });
    }

    position.lastYieldClaim = now;
    position.yieldEarned += yieldClaimed;
    await position.save();

    // Update User
    await User.findByIdAndUpdate(position.stakerId, {
      $inc: { totalEarned: yieldClaimed }
    });

    return NextResponse.json({ yieldClaimed: Number(yieldClaimed.toFixed(4)) });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
