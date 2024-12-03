import { NextResponse } from "next/server";
import { authMiddleware } from "@/middleware/authMiddleware";
import dbConnect from "@/lib/connectDb";
import User from "@/models/Users";

// Get all users only admin

export const GET = async(req: Request) => {
    const middlewareResponse = await authMiddleware(req, ['user', 'admin']);
    if(middlewareResponse){
        return middlewareResponse;
    }
    await dbConnect();
    const users = await User.find({});
    return NextResponse.json(users);
}


