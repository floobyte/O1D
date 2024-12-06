import dbConnect from "@/lib/connectDb";
import User from "@/models/Users";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest, { params }: { params: { id: string }}) {
    await dbConnect();

    const userId  = params.id

    try {
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const resetToken = user.resetToken;

        return NextResponse.json({ resetToken }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error fetching reset token' }, { status: 500 });
    }
}
