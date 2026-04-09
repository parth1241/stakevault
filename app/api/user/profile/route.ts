import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const { name, avatarColor, preferences } = await req.json();

    const updateData: any = {};
    if (name) updateData.name = name;
    if (avatarColor) updateData.avatarColor = avatarColor;
    if (preferences) updateData.preferences = preferences;

    const user = await User.findByIdAndUpdate(
      (session.user as any).id,
      { $set: updateData },
      { new: true }
    );

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
