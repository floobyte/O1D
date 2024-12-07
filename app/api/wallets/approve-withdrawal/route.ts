// app/api/wallet/approve-withdrawal/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';
import Wallet from '@/models/Wallet';
import User from '@/models/Users';
import Notification from '@/models/Notification';
import WalletHistory from '@/models/WalletHistory';
import { authMiddleware } from '@/middleware/authMiddleware';

export async function POST(req: Request) {

  const authResult = await authMiddleware(req, ['admin']);

  if(authResult){
    return authResult;
  }

  try {
    await dbConnect();
    const { username, walletId, amount } = await req.json();

    if (!walletId || !amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid wallet ID or amount' }, { status: 400 });
    }

    // Find the User by username
    const user = await User.findOne( username );
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
  
    console.log(user);
    // Find the wallet by ID
    const wallet = await Wallet.findById(walletId);
    if (!wallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
    }

    // Check if sufficient pending funds are available
    if (wallet.pendingWithdrawal < amount) {
      return NextResponse.json({ error: 'Insufficient pending withdrawal funds' }, { status: 400 });
    }

    // Notify that withdrawal request is being processed
    const processingNotification = new Notification({
      userId: user._id,
      userRole: user.role,
      message: `Your withdrawal request for ${amount} is being processed.`,
      readStatus: false,
    });
    await processingNotification.save();

    // Update wallet: move amount from pendingWithdrawal to withdrawFund
    let pendingWithdrawalRemain = wallet.pendingWithdrawal;
    pendingWithdrawalRemain -= amount;
    wallet.withdrawFund += amount;
    wallet.pendingWithdrawal = pendingWithdrawalRemain;
    await wallet.save();

    // Notify successful withdrawal
    const successNotification = new Notification({
      userId: user._id,
      userRole: user.role,
      message: `Withdrawal Successful: ${amount}`,
      readStatus: false,
    });
    await successNotification.save();

    // Add wallet History
    const newWalletHistory = await WalletHistory.create({
      walletId: wallet._id,
      userId: user,
      transactionType: 'withdraw',
      amount,
      balanceAfterTransaction: wallet.checkFund, // Updated balance after withdrawal
      approvalStatus: 'Successful',
      approvewithDrawalReq:"approvewithDrawalReq",
      transactionDate: new Date(),
    })

    await newWalletHistory.save();


    return NextResponse.json({ message: 'Withdrawal approved', wallet }, { status: 200 });
  } catch (error) {
    console.error('Error approving withdrawal:', error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}
