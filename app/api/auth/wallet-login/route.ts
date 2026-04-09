import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { linkedWallet } = await req.json();

    if (!linkedWallet) {
      return NextResponse.json({ error: "Wallet address required" }, { status: 400 });
    }

    const user = await User.findOne({ linkedWallet });

    if (!user) {
      return NextResponse.json({ error: "No user found linked to this wallet" }, { status: 404 });
    }

    user.lastLogin = new Date();
    await user.save();

    return NextResponse.json({ 
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
        linkedWallet: user.linkedWallet,
        avatarColor: user.avatarColor,
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
