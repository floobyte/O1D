import Wallet from '@/models/Wallet';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';

type userWallets = {
    addFund: number;
    withdrawFund: number;
    checkFund: number;
    pendingWithdrawal: number;
};

export async function GET() {
    await dbConnect();

    try {
        // Get all wallets from the database
        const wallets: userWallets[] = await Wallet.find({});

        // Initial Total Funds
        let totalAddedFund = 0;
        let totalWithdrawFund = 0;
        let totalCheckFund = 0;
        let totalPendingWithdrawal = 0;

        // Calculate Total Funds using forEach Loop
        wallets.forEach((wallet) => {
            totalAddedFund += wallet.addFund;
            totalWithdrawFund += wallet.withdrawFund;
            totalCheckFund += wallet.checkFund;
            totalPendingWithdrawal += wallet.pendingWithdrawal;
        });

        // Store the totals in an array
        const universalWallet = [
            { name: 'Total Added Funds', value: totalAddedFund },
            { name: 'Total Withdrawal Funds', value: totalWithdrawFund },
            { name: 'Total Available Funds', value: totalCheckFund },
            { name: 'Total Pending Withdrawals', value: totalPendingWithdrawal },
        ];

        // Log totals for debugging
        console.log("Universal Wallet: ", universalWallet);

        // Return the response
        return NextResponse.json(
            {
                message: "All wallets fetched successfully!",
                universalWallet: universalWallet,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "An internal error occurred!" },
            { status: 500 }
        );
    }
}
