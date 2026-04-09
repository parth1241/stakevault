import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ContractConfig from "@/lib/models/ContractConfig";

export async function GET() {
  try {
    await dbConnect();
    // If no config exists, create a default one (usually done during deployment)
    let config = await ContractConfig.findOne();
    
    if (!config) {
      config = await ContractConfig.create({
        contractId: "CCVPZV...HACKATHON_STUB",
        adminWallet: "G...",
        totalStaked: 4291.50,
        totalStakers: 124,
      });
    }

    // Return public fields only
    const publicConfig = {
      contractId: config.contractId,
      apyRates: config.apyRates,
      minStake: config.minStake,
      maxStake: config.maxStake,
      totalStaked: config.totalStaked,
      totalStakers: config.totalStakers,
      isActive: config.isActive,
      deployedAt: config.deployedAt,
    };

    return NextResponse.json(publicConfig);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
