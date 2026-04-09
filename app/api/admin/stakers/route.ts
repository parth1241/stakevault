import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import StakePosition from "@/lib/models/StakePosition";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const stakers = await User.find({ role: 'staker' });

    const stakerDetails = await Promise.all(stakers.map(async (user) => {
      const positions = await StakePosition.find({ stakerId: user._id });
      const totalStaked = positions.reduce((acc, p) => p.status === 'active' ? acc + p.amountXLM : acc, 0);
      const totalEarned = positions.reduce((acc, p) => acc + (p.yieldEarned || 0), 0);
      
      return {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          linkedWallet: user.linkedWallet,
          avatarColor: user.avatarColor,
          createdAt: user.createdAt,
        },
        positionCount: positions.length,
        totalStaked: Number(totalStaked.toFixed(2)),
        totalEarned: Number(totalEarned.toFixed(4)),
      };
    }));

    return NextResponse.json({ stakers: stakerDetails });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
