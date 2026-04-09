import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import StakePosition from "@/lib/models/StakePosition";
import User from "@/lib/models/User";
import ContractConfig from "@/lib/models/ContractConfig";

export async function POST(
  req: Request,
  { params }: { params: { positionId: string } }
) {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const { txHash } = await req.json();
    const position = await StakePosition.findById(params.positionId);

    if (!position) return NextResponse.json({ error: "Position not found" }, { status: 404 });
    if (position.status !== 'active') return NextResponse.json({ error: "Position already closed" }, { status: 400 });

    const now = new Date();
    if (new Date(position.unlocksAt) > now) {
      return NextResponse.json({ error: "Position still locked" }, { status: 400 });
    }

    // yield = amount * apy * (lockDays/365)
    const finalYield = position.amountXLM * position.apyRate * (position.lockPeriodDays / 365);
    const totalReturned = position.amountXLM + finalYield;

    position.status = 'withdrawn';
    position.txHashUnstake = txHash;
    position.yieldEarned = finalYield;
    await position.save();

    // Update User
    await User.findByIdAndUpdate(position.stakerId, {
      $inc: { 
        totalStaked: -position.amountXLM,
        totalEarned: finalYield
      }
    });

    // Update Contract Config
    await ContractConfig.findOneAndUpdate({}, {
      $inc: { totalStaked: -position.amountXLM }
    });

    return NextResponse.json({ yieldEarned: Number(finalYield.toFixed(4)), totalReturned: Number(totalReturned.toFixed(4)) });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
