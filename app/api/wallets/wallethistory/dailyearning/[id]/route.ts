import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/connectDb";
import WalletHistory from "@/models/WalletHistory";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
    const walletId = params.id;

    try {
        const walletHistory = await WalletHistory.find({ walletId: walletId });
        return NextResponse.json({ walletHistory: walletHistory }, { status: 200 });
    } catch (error) {
        console.error("Failed to get the walletHistory!", error);
        return NextResponse.json(
            { message: "Failed to get the walletHistory!" },
            { status: 500 }
        );
    }
}