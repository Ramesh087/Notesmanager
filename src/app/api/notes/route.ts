import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/index";
import { Note } from "@/lib/models/notes";
import { ApiResponse } from "@/utils/ApiResponse";
import { ApiError } from "@/utils/ApiError";
import jwt from "jsonwebtoken";


export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    
    let userId = req.headers.get("x-user-id");
    let isAdmin = req.headers.get("x-user-admin") === "true";
    if (!userId) {
      const accessToken = req.cookies.get("accessToken")?.value;
      if (accessToken) {
        try {
          const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string) as { _id?: string, isAdmin?: boolean };
          if (decoded && decoded._id) userId = decoded._id;
          if (typeof decoded.isAdmin === "boolean") isAdmin = decoded.isAdmin;
        } catch {}
      }
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const order = searchParams.get("order") === "desc" ? -1 : 1;
    const skip = (page - 1) * limit;

    
    if (!isAdmin && !userId) {
      throw new ApiError(401, "Unauthorized: User not found");
    }
    const query = isAdmin ? {} : { owner: userId };

    const total = await Note.countDocuments(query);
    const notes = await Note.find(query)
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limit)
      .populate("owner", "username email fullname"); 

    return NextResponse.json(
      new ApiResponse(200, { total, page, limit, notes }, "Notes fetched successfully")
    );
  } catch (error: any) {
    const apiError = new ApiError(500, error.message || "Server Error");
    return NextResponse.json(new ApiResponse(apiError.statusCode, null, apiError.message), {
      status: apiError.statusCode,
    });
  }
}


export async function POST(req: NextRequest) {
  try {
    await dbConnect();

   
    let userId = req.headers.get("x-user-id");
    if (!userId) {
      const accessToken = req.cookies.get("accessToken")?.value;
      if (accessToken) {
        try {
          const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string) as { _id?: string };
          if (decoded && decoded._id) userId = decoded._id;
        } catch {}
      }
    }
    if (!userId) throw new ApiError(401, "Unauthorized: User not found");

    const body = await req.json();
    const { title, description } = body;

    if (!title || !description) {
      throw new ApiError(400, "Title & Description are required");
    }

    const note = await Note.create({
      title,
      description,
      owner: userId,
    });

    return NextResponse.json(new ApiResponse(201, note, "Note created successfully"), {
      status: 201,
    });
  } catch (error: any) {
    const apiError = error instanceof ApiError ? error : new ApiError(500, error.message || "Server Error");
    return NextResponse.json(new ApiResponse(apiError.statusCode, null, apiError.message), {
      status: apiError.statusCode,
    });
  }
}
