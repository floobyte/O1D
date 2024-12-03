import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/connectDb";
import Wallet from "@/models/Wallet";

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  await dbConnect();

  const { id: walletId } = context.params; // Ensure params is accessed correctly
  console.log({ walletId });

  try {
    const wallet = await Wallet.findById(walletId);
    if (!wallet) {
      return NextResponse.json(
        { message: "Wallet not found!" },
        { status: 404 }
      );
    }
    return NextResponse.json({ wallet }, { status: 200 });
  } catch (error) {
    console.error("Failed to get the wallet history!", error);
    return NextResponse.json(
      { message: "Failed to get the wallet history!" },
      { status: 500 }
    );
  }
}
