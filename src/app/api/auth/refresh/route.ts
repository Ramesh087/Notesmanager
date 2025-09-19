import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import  User  from "@/lib/models/user";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { generateAccessAndRefreshTokens } from "@/lib/auth";


interface RefreshTokenPayload extends JwtPayload {
  _id: string;
}

export async function POST(req: NextRequest) {
  try {
    
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get("refreshToken")?.value;
    const body = await req.json().catch(() => ({}));
    const incomingRefreshToken: string | undefined =
      cookieToken || body.refreshToken;

    if (!incomingRefreshToken) {
      return NextResponse.json(
        new ApiError(401, "Unauthorized request"),
        { status: 401 }
      );
    }

    
    let decodedToken: RefreshTokenPayload;
    try {
  decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET!
  ) as RefreshTokenPayload;
} catch (err: unknown) {
  // Optional: log error details safely
  if (err instanceof Error) {
    console.error("JWT verification failed:", err.message);
  } else {
    console.error("JWT verification failed:", err);
  }

  return NextResponse.json(
    new ApiError(401, "Invalid refresh token"),
    { status: 401 }
  );
}


    const user = await User.findById(decodedToken._id);
    if (!user) {
      return NextResponse.json(
        new ApiError(401, "Invalid refresh token"),
        { status: 401 }
      );
    }

    
    if (user.refreshToken !== incomingRefreshToken) {
      return NextResponse.json(
        new ApiError(401, "Refresh token is expired or already used"),
        { status: 401 }
      );
    }


    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    const response = NextResponse.json(
      new ApiResponse(
        200,
        { accessToken, refreshToken: newRefreshToken },
        "Access token refreshed"
      ),
      { status: 200 }
    );

    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
    });

    response.cookies.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    return NextResponse.json(
      new ApiError(500,  error instanceof Error ? error.message : "Internal server error"),
      { status: 500 }
    );
  }
}
