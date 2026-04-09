import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const { linkedWallet } = await req.json();

    if (!linkedWallet) return NextResponse.json({ error: "Wallet address required" }, { status: 400 });

    const existingUser = await User.findOne({ linkedWallet, _id: { $ne: (session.user as any).id } });
    if (existingUser) {
      return NextResponse.json({ error: "Wallet already linked to another account" }, { status: 400 });
    }

    await User.findByIdAndUpdate((session.user as any).id, { linkedWallet });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
