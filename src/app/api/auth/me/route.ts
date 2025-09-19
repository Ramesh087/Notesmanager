import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/lib/models/user";
import dbConnect from "@/lib/db/index";

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const token = req.cookies.get("accessToken")?.value;
    if (!token) return NextResponse.json({ isLoggedIn: false, isAdmin: false }, { status: 401 });

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as { _id: string };
    const user = await User.findById(decoded._id).select("isAdmin");
    if (!user) return NextResponse.json({ isLoggedIn: false, isAdmin: false }, { status: 401 });

    return NextResponse.json({ isLoggedIn: true, isAdmin: user.isAdmin });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ isLoggedIn: false, isAdmin: false }, { status: 401 });
  }
}
