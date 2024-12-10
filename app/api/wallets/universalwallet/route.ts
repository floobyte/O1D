import Wallet from '@/models/Wallet';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';

export async function GET() {
    await dbConnect();

    try {
        // Fetch all wallets
        const wallets = await Wallet.find({});

        if (!wallets || wallets.length === 0) {
            return NextResponse.json(
                { message: "No wallet records found." },
                { status: 404 }
            );
        }

        // Calculate totals
        const universalWallet = wallets.reduce(
            (acc, wallet) => {
                acc.totalAddedFund += wallet.addFund || 0;
                acc.totalWithdrawFund += wallet.withdrawFund || 0;
                acc.totalCheckFund += wallet.checkFund || 0;
                acc.totalPendingWithdrawal += wallet.pendingWithdrawal || 0;
                return acc;
            },
            {
                totalAddedFund: 0,
                totalWithdrawFund: 0,
                totalCheckFund: 0,
                totalPendingWithdrawal: 0,
            }
        );

        const responseArray = [
            { name: "Total Added Funds", value: universalWallet.totalAddedFund },
            { name: "Total Withdrawal Funds", value: universalWallet.totalWithdrawFund },
            { name: "Total Available Funds", value: universalWallet.totalCheckFund },
            { name: "Total Pending Withdrawals", value: universalWallet.totalPendingWithdrawal },
        ];

        // Send response
        return NextResponse.json(
            {
                message: "All wallets fetched successfully!",
                universalWallet: responseArray,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching wallets:", error);
        return NextResponse.json(
            { message: "An internal error occurred!" },
            { status: 500 }
        );
    }
}



// import Wallet from '@/models/Wallet';
// import { NextResponse } from 'next/server';
// import dbConnect from '@/lib/connectDb';

// type userWallets = {
//     addFund: number;
//     withdrawFund: number;
//     checkFund: number;
//     pendingWithdrawal: number;
// };

// export async function GET() {
//     await dbConnect();

//     try {
//         // Get all wallets from the database
//         const wallets: userWallets[] = await Wallet.find({});

//         // Initial Total Funds
//         let totalAddedFund = 0;
//         let totalWithdrawFund = 0;
//         let totalCheckFund = 0;
//         let totalPendingWithdrawal = 0;

//         // Calculate Total Funds using forEach Loop
//         wallets.forEach((wallet) => {
//             totalAddedFund += wallet.addFund;
//             totalWithdrawFund += wallet.withdrawFund;
//             totalCheckFund += wallet.checkFund;
//             totalPendingWithdrawal += wallet.pendingWithdrawal;
//         });

//         // Store the totals in an array
//         const universalWallet = [
//             { name: 'Total Added Funds', value: totalAddedFund },
//             { name: 'Total Withdrawal Funds', value: totalWithdrawFund },
//             { name: 'Total Available Funds', value: totalCheckFund },
//             { name: 'Total Pending Withdrawals', value: totalPendingWithdrawal },
//         ];

//         // Log totals for debugging
//         console.log("Universal Wallet: ", universalWallet);

//         // Return the response
//         return NextResponse.json(
//             {
//                 message: "All wallets fetched successfully!",
//                 universalWallet: universalWallet,
//             },
//             { status: 200 }
//         );
//     } catch (error) {
//         console.error(error);
//         return NextResponse.json(
//             { message: "An internal error occurred!" },
//             { status: 500 }
//         );
//     }
// }
