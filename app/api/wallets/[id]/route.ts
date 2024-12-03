import { NextResponse,NextRequest } from "next/server";
import dbConnect from "@/lib/connectDb";
import Wallet from "@/models/Wallet";

export async function GET(req: NextRequest, { params }: { params: { id: string}}) {
    await dbConnect();
    const walletId = params.id;
    try {
        const wallet = await Wallet.findById(walletId);
         return NextResponse.json({ wallet: wallet}, { status: 200 });   
        
    } catch (error) {
        console.error('Failed to getting the notifications!', error);
        NextResponse.json(
            {
                message:'Failed to getting the notifications!'
            },
            {
                status: 500
            }
        )
    }
}
