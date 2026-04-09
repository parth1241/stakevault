import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import ContractConfig from "@/lib/models/ContractConfig";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession();
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    const { apyRates, minStake, maxStake, isActive } = body;

    const config = await ContractConfig.findOne();
    if (!config) return NextResponse.json({ error: "Contract not found" }, { status: 404 });

    if (apyRates) config.apyRates = { ...config.apyRates, ...apyRates };
    if (minStake !== undefined) config.minStake = minStake;
    if (maxStake !== undefined) config.maxStake = maxStake;
    if (isActive !== undefined) config.isActive = isActive;

    config.lastUpdated = new Date();
    await config.save();

    return NextResponse.json(config);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
