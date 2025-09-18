import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/index";
import { Note } from "@/lib/models/notes";
import { ApiResponse } from "@/utils/ApiResponse";
import { ApiError } from "@/utils/ApiError";
import jwt from "jsonwebtoken";
import User from "@/lib/models/user";

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();

    const { id: noteId } = await ctx.params;

   
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
    if (!isAdmin && userId) {
      const u = await User.findById(userId).select("isAdmin");
      if (u?.isAdmin) isAdmin = true;
    }

    if (!noteId) throw new ApiError(400, "Note ID is required");

    const note = await Note.findById(noteId);
    if (!note) throw new ApiError(404, "Note not found");

    if (!isAdmin && note.owner.toString() !== userId) {
      throw new ApiError(403, "Forbidden: You cannot view this note");
    }

    return NextResponse.json(new ApiResponse(200, note, "Note fetched successfully"));
  } catch (error: unknown) {
  let apiError: ApiError;

  if (error instanceof ApiError) {
    apiError = error;
  } else if (error instanceof Error) {
    apiError = new ApiError(500, error.message || "Server Error");
  } else {
    apiError = new ApiError(500, "Server Error");
  }

  return NextResponse.json(
    new ApiResponse(apiError.statusCode, null, apiError.message),
    { status: apiError.statusCode }
  );
}
}


export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();

    const { id: noteId } = await ctx.params;

   
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
    if (!isAdmin && userId) {
      const u = await User.findById(userId).select("isAdmin");
      if (u?.isAdmin) isAdmin = true;
    }

    if (!noteId) throw new ApiError(400, "Note ID is required");

    const note = await Note.findById(noteId);
    if (!note) throw new ApiError(404, "Note not found");

   
    if (!isAdmin && note.owner.toString() !== userId) {
      throw new ApiError(403, "Forbidden: You cannot edit this note");
    }

    const body = await req.json();
    const { title, description, isPublished } = body;

    if (title !== undefined) note.title = title;
    if (description !== undefined) note.description = description;
  

    await note.save();

    return NextResponse.json(new ApiResponse(200, note, "Note updated successfully"));
  } catch (error: unknown) {
  let apiError: ApiError;

  if (error instanceof ApiError) {
    apiError = error;
  } else if (error instanceof Error) {
    apiError = new ApiError(500, error.message || "Server Error");
  } else {
    apiError = new ApiError(500, "Server Error");
  }

  return NextResponse.json(
    new ApiResponse(apiError.statusCode, null, apiError.message),
    { status: apiError.statusCode }
  );
}

}


export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();

    const { id: noteId } = await ctx.params;

    // Resolve user identity from middleware headers or accessToken cookie
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
    if (!isAdmin && userId) {
      const u = await User.findById(userId).select("isAdmin");
      if (u?.isAdmin) isAdmin = true;
    }

    if (!noteId) throw new ApiError(400, "Note ID is required");

    const note = await Note.findById(noteId);
    if (!note) throw new ApiError(404, "Note not found");

    // Permission check
    if (!isAdmin && note.owner.toString() !== userId) {
      throw new ApiError(403, "Forbidden: You cannot delete this note");
    }

    await Note.findByIdAndDelete(noteId);

    return NextResponse.json(new ApiResponse(200, null, "Note deleted successfully"));
  }catch (error: unknown) {
  let apiError: ApiError;

  if (error instanceof ApiError) {
    apiError = error;
  } else if (error instanceof Error) {
    apiError = new ApiError(500, error.message || "Server Error");
  } else {
    apiError = new ApiError(500, "Server Error");
  }

  return NextResponse.json(
    new ApiResponse(apiError.statusCode, null, apiError.message),
    { status: apiError.statusCode }
  );
}

}
