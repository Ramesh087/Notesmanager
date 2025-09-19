// file: middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ApiResponse } from "@/utils/ApiResponse";
import { ApiError } from "@/utils/ApiError";

interface MyJwtPayload extends JwtPayload {
  _id: string;
  isAdmin: boolean;
}

export function middleware(req: NextRequest) {
  try {
    const token = req.cookies.get("accessToken")?.value;

    if (!token) {
      throw new ApiError(401, "Unauthorized: No token provided");
    }

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as MyJwtPayload;

    // Inject user info into headers for API routes
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", decoded._id);
    requestHeaders.set("x-user-admin", decoded.isAdmin ? "true" : "false");

    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  } catch (err: any) {
    const error =
      err instanceof ApiError
        ? err
        : new ApiError(401, "Unauthorized: Invalid or expired token");

    return handleUnauthorized(req, error);
  }
}

function handleUnauthorized(req: NextRequest, error: ApiError) {
  // If it’s an API request → return JSON response
  if (req.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.json(
      new ApiResponse(error.statusCode, null, error.message),
      { status: error.statusCode }
    );
  }

  // Otherwise redirect to login page
  return NextResponse.redirect(new URL("/auth/login", req.url));
}

// ✅ Only protect these routes
export const config = {
  matcher: [
    "/",                // homepage (notes listing)
    "/notes/:path*",    // notes pages
    "/api/notes/:path*",// notes APIs
    "/api/auth/logout", // logout requires login
  ],
};
