// app/api/wallet/approve-withdrawal/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';
import Wallet from '@/models/Wallet';
import WalletHistory from '@/models/WalletHistory';
import Notification from '@/models/Notification';
import { authMiddleware } from '@/middleware/authMiddleware';
import mongoose from 'mongoose';

export async function POST(req: Request) {
  const authResult = await authMiddleware(req, ['admin']);
  if (authResult) {
    return authResult;
  }

  try {
    await dbConnect();
    const { transactionId } = await req.json();

    if (!transactionId) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
    }

    // Find the transaction in WalletHistory
    const transaction = await WalletHistory.findById(new mongoose.Types.ObjectId(transactionId.toString())).populate('walletId');
    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

  

    // Ensure the transaction is a withdrawal request and is pending
    // if (transaction.transactionType !== 'withdraw' || transaction.approvalStatus !== 'pending') {
    //   return NextResponse.json({ message: 'Transaction is not a pending withdrawal' }, { status: 400 });
    // }

    // Find the associated wallet
    const wallet = await Wallet.findById(transaction.walletId._id);
    if (!wallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
    }

    // Ensure sufficient pending withdrawal funds exist
    if (wallet.pendingWithdrawal < transaction.amount) {
      return NextResponse.json({ error: 'Insufficient pending withdrawal funds' }, { status: 400 });
    }

    // let remainPendingWithdrawal = wallet.pendingWithdrawal;
    // Approve the withdrawal
    wallet.pendingWithdrawal -= transaction.amount;
    wallet.withdrawFund += transaction.amount;
    await wallet.save();

    // Update transaction status to approved
    // transaction.approvalStatus = 'approved';
    transaction.balanceAfterTransaction = wallet.checkFund; // Update balance after transaction
    await transaction.save();

    // Notify the user of successful withdrawal
    const notification = new Notification({
      userId: transaction.userId,
      walletId: wallet._id,
      transactionId: transaction._id,
      message: `Your withdrawal request for ${transaction.amount} has been approved.`,
      readStatus: false,
      approvewithDrawalReq:"approvewithDrawalReq",
      approvalStatus:'Successful'
    });
    await notification.save();

    let amount = transaction.amount;
    const newWalletHistory = await WalletHistory.create({
      walletId: wallet._id,
      userId: transaction.userId,
      transactionType: 'withdraw',
      amount,
      message: `Your withdrawal request for ${transaction.amount} has been approved.`,
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
