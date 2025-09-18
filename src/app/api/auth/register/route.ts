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
    const { fullname, email, username, password } = body;

    // validation
    if (
      [fullname, email, username, password].some(
        (field: string) => !field || field.trim() === ""
      )
    ) {
      return NextResponse.json(
        new ApiError(400, "All fields are required"),
        { status: 400 }
      );
    }

    // check if user exists
    const existedUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existedUser) {
      return NextResponse.json(
        new ApiError(409, "User with email or username already exists"),
        { status: 409 }
      );
    }

    // create user
    const user = await User.create({
      fullname,
      email,
      password,
      username: username.toLowerCase(),
    });

    // remove sensitive fields
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      return NextResponse.json(
        new ApiError(500, "Something went wrong while registering the user"),
        { status: 501 }
      );
    }

   
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const response = NextResponse.json(
      new ApiResponse(201, { user: createdUser, accessToken, refreshToken }, "User registered successfully"),
      { status: 201 }
    );

    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Register Error:", error);
    return NextResponse.json(
      new ApiError(500, error.message || "Internal server error"),
      { status: 500 }
    );
  }
};
