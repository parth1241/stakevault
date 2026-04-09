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

    const penalty = position.amountXLM * 0.1;
    const amountReturned = position.amountXLM - penalty;

    position.status = 'emergency_withdrawn';
    position.txHashUnstake = txHash;
    await position.save();

    // Update User
    await User.findByIdAndUpdate(position.stakerId, {
      $inc: { totalStaked: -position.amountXLM }
    });

    // Update Contract Config
    await ContractConfig.findOneAndUpdate({}, {
      $inc: { totalStaked: -position.amountXLM }
    });

    return NextResponse.json({ 
      penalty: Number(penalty.toFixed(4)), 
      amountReturned: Number(amountReturned.toFixed(4)) 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
