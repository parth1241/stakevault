import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import StakePosition from "@/lib/models/StakePosition";
import User from "@/lib/models/User";
import ContractConfig from "@/lib/models/ContractConfig";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session || (session.user as any).role !== 'staker') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { amountXLM, lockPeriodDays, txHash, stakerWallet } = await req.json();

    const config = await ContractConfig.findOne();
    if (!config) return NextResponse.json({ error: "Contract not initialized" }, { status: 500 });

    if (amountXLM < config.minStake || amountXLM > config.maxStake) {
      return NextResponse.json({ error: "Invalid stake amount" }, { status: 400 });
    }

    if (![7, 30, 90].includes(lockPeriodDays)) {
      return NextResponse.json({ error: "Invalid lock period" }, { status: 400 });
    }

    const existingTx = await StakePosition.findOne({ txHashStake: txHash });
    if (existingTx) {
      return NextResponse.json({ error: "Transaction already processed" }, { status: 400 });
    }

    const apyKey = `days${lockPeriodDays}` as keyof typeof config.apyRates;
    const apyRate = (config.apyRates as any)[apyKey];

    const unlocksAt = new Date();
    unlocksAt.setDate(unlocksAt.getDate() + lockPeriodDays);

    const position = await StakePosition.create({
      stakerId: (session.user as any).id,
      stakerWallet,
      contractId: config.contractId,
      amountXLM,
      lockPeriodDays,
      apyRate,
      unlocksAt,
      txHashStake: txHash,
      status: 'active',
    });

    // Update User
    await User.findByIdAndUpdate((session.user as any).id, {
      $inc: { totalStaked: amountXLM }
    });

    // Update Contract Config
    config.totalStaked += amountXLM;
    config.totalStakers += 1;
    await config.save();

    return NextResponse.json({ position });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
