import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/connectDb";
import  User from "@/models/Users";
import  RentalHistory from "@/models/RentalHistory";
import  WalletHistory from "@/models/WalletHistory";
import { authMiddleware } from "@/middleware/authMiddleware";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {

 const authResult = await authMiddleware(request, ['admin']);
 if(authResult){
    return authResult;
 }
 
  await dbConnect();

  const  userId  = params.id;

  try {
    // Fetch user by ID
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ status: "error", message: "User not found" });
    }

    const walletId = user.wallet;

    // Check active rentals
    const activeRental = await RentalHistory.findOne({
      user: userId,
      rentDate: { $lte: new Date() },
      $expr: {
        $gt: [
          { $add: ["$rentDate", { $multiply: ["$rentalPeriod", 24 * 60 * 60 * 1000] }] },
          new Date(),
        ],
      },
    });

    // Check recent wallet transactions
    const recentTransaction = await WalletHistory.findOne({
      walletId: walletId,
      transactionType: "credited_daily_earning",
      transactionDate: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    // Determine user status
    const status = activeRental || recentTransaction ? "Active" : "Inactive";

    return NextResponse.json({ status, userId });
  } catch (error) {
    console.error("Error checking user status:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
