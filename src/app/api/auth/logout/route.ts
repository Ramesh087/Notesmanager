import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/db/index";
import User from "@/lib/models/user";
import { ApiResponse }  from "@/utils/ApiResponse"; 

export async function POST(): Promise<NextResponse> {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (refreshToken) {
      // Remove refreshToken from user document
      await User.findOneAndUpdate(
        { refreshToken },
        { $unset: { refreshToken: 1 } },
        { new: true }
      );
    }

    const res = NextResponse.json(new ApiResponse(200, null, "User logged out"), { status: 200 });

    
    res.cookies.set("accessToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0),
      sameSite: "lax",
      path: "/",
    });

    res.cookies.set("refreshToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0),
      sameSite: "lax",
      path: "/",
    });

    return res;
  } catch (error:unknown) {
    return NextResponse.json(
      new ApiResponse(500, null, "Internal Server Error"),
      { status: 500 }
    );
  }
}
