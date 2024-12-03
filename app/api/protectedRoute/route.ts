import { NextResponse } from "next/server";
import { authMiddleware } from "@/middleware/authMiddleware";

export const GET = async (req: Request) => {
  // Run the middleware and capture its response if any
  const middlewareResponse = await authMiddleware(req, ["admin"]);

  // Check if middlewareResponse has a value, which indicates an error response
  if (middlewareResponse) {
    return middlewareResponse;
  }

  // Main logic for the protected route if authorized
  return NextResponse.json({ message: "Welcome, Admin!" });
};
