import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';
import Wallet from '@/models/Wallet';
import WalletHistory from '@/models/WalletHistory';
import Notification from '@/models/Notification';
import User from '@/models/Users';

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const {username, amount } = await req.json();

    if (!username || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid request. Provide a valid username and a positive amount.' },
        { status: 400 }
      );
    }

    // Find user and wallet
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Amount must be greater than 0.' }, { status: 400 });
    }

    const wallet = await Wallet.findOne();
    if (!wallet || wallet.checkFund < amount) {
      return NextResponse.json({ error: 'Insufficient funds.' }, { status: 400 });
    }

    wallet.withdrawFund += amount;
    wallet.checkFund -= amount;

    const newWalletHistory = await WalletHistory.create({
      walletId: wallet._id,
      userId: user._id,
      transactionType: 'debited',
      amount,
      balanceAfterTransaction: wallet.checkFund + amount, // Projected balance after approval
      transactionDate: new Date(),
      approvalStatus: 'pending' // New field to track admin approval
    });

    const walletNotification = new Notification({
      userId: user,
      userRole: user.role,
      transactionId: newWalletHistory._id,
      message: `amount ${amount} is Debited.`,
      readStatus: true
    });
    await walletNotification.save();

    await wallet.save();

    return NextResponse.json(wallet, { status: 200 });
  } catch (error) {
    console.error('Error withdrawing funds:', error);
    return NextResponse.json({ error: 'Failed to withdraw funds.' }, { status: 500 });
  }
}
