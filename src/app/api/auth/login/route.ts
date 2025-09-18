import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/index";
import User from "@/lib/models/user";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { generateAccessAndRefreshTokens } from "@/lib/auth";


export const POST = async (req: NextRequest) => {
  try {
    await dbConnect();

    const body = await req.json();
    const { email, username, password } = body;

    
    if (!username && !email) {
      return NextResponse.json(
        new ApiError(400, "Username or email is required"),
        { status: 400 }
      );
    }

    const user = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (!user) {
      return NextResponse.json(new ApiError(404, "User does not exist"), {
        status: 404,
      });
    }

    // check password
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        new ApiError(401, "Invalid user credentials"),
        { status: 401 }
      );
    }

   
    const adminList = (process.env.ADMIN_EMAILS || "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
    if (adminList.length && (adminList.includes(user.email.toLowerCase()) || adminList.includes(user.username.toLowerCase()))) {
      if (!user.isAdmin) {
        user.isAdmin = true;
        await user.save({ validateBeforeSave: false });
      }
    }

 
    const { accessToken, refreshToken } =
      await generateAccessAndRefreshTokens(user._id);

   
    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!loggedInUser) {
      return NextResponse.json(
        new ApiError(500, "User not found after login"),
        { status: 500 }
      );
    }

   
    const response = NextResponse.json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      ),
      { status: 200 }
    );

    
    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });

    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    console.error("Login Error:", error);
    return NextResponse.json(
      new ApiError(500,  error instanceof Error ? error.message : "Internal server error"),
      { status: 500 }
    );
  }
};
