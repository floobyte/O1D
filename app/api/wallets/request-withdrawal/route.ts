import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';
import Wallet from '@/models/Wallet';
import User from '@/models/Users';
import Notification from '@/models/Notification';
import WalletHistory from '@/models/WalletHistory';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { username, amount } = await req.json();

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

    const wallet = await Wallet.findById(user.wallet);
    if (!wallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
    }

    // Check if there are sufficient funds
    if (wallet.checkFund < amount) {
      const insufficientFundsNotification = new Notification({
        userId: user._id,
        userRole: user.role,
        message: `Withdrawal request for ${amount} cannot be processed due to insufficient funds.`,
        readStatus: false,
      });
      await insufficientFundsNotification.save();
      return NextResponse.json({ error: 'Insufficient funds' }, { status: 400 });
    }

    // Create a pending transaction in WalletHistory for admin approval
    const newWalletHistory = await WalletHistory.create({
      walletId: wallet._id,
      userId: user._id,
      transactionType: 'withdrawal',
      amount,
      balanceAfterTransaction: wallet.checkFund - amount, // Projected balance after approval
      transactionDate: new Date(),
      approvalStatus: 'pending', // Pending admin approval
      
    });

    // Update wallet: move amount to pendingWithdrawal
    wallet.pendingWithdrawal += amount;
    wallet.checkFund -= amount;
    await wallet.save();

    // Notify user of pending status
    // const userNotification = new Notification({
    //   userId: user._id,
    //   userRole: user.role,
    //   transactionId: newWalletHistory._id,
    //   message: `Your withdrawal request for ${amount} is pending admin approval.`,
    //   readStatus: false,
    // });
    // await userNotification.save();

    // Notify admin of the new withdrawal request
    const adminNotification = new Notification({
      userId: user, // Use a predefined admin identifier or leave null for general admin notifications
      userRole: user.role,
      transactionId: newWalletHistory._id,
      message: `User ${username} has requested a withdrawal of ${amount}.`,
      readStatus: false,
      withDrawalReq:"withDrawalReq"
    });
    await adminNotification.save();

    return NextResponse.json(
      { message: 'Withdrawal request sent successfully and is pending admin approval.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing withdrawal request:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}




// import { NextResponse } from 'next/server';
// import dbConnect from '@/lib/connectDb';
// import Wallet from '@/models/Wallet';
// import User from '@/models/Users';
// import Notification from '@/models/Notification';
// import WalletHistory from '@/models/WalletHistory';

// export async function POST(req: Request) {
//   try {
//     await dbConnect();
//     const { username, walletId, amount } = await req.json();

//     if (!walletId || !amount || amount <= 0) {
//       return NextResponse.json({ error: 'Invalid wallet ID or amount' }, { status: 400 });
//     }

//     const user = await User.findOne({ username });
//     console.log({user});
//     if (!user) {
//       return NextResponse.json({ error: 'User not found' }, { status: 404 });
//     }

//     const wallet = await Wallet.findById(walletId);
//     if (!wallet) {
//       return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
//     }

//     if (wallet.checkFund < amount) {
//       const pendingNotification = new Notification({
//         userId: user._id,
//         userRole: user.role,
//         message: `Withdrawal Pending: Insufficient funds for requested amount ${amount}.`,
//         readStatus: false,
//       });
//       await pendingNotification.save();
//       return NextResponse.json({ error: 'Insufficient funds' }, { status: 400 });
//     }

//     const newWalletHistory = await WalletHistory.create({
//       walletId: wallet._id,
//       userId: user._id,
//       transactionType: 'withDrawal',
//       amount,
//       balanceAfterTransaction: wallet.checkFund - amount,
//       transactionDate: new Date(),
//       approvalStatus: 'pending',
//     });

//     const newWalletHistoryId = newWalletHistory._id.toString();
//     console.log("New Wallet History ID:", newWalletHistoryId);

//     wallet.pendingWithdrawal += amount;
//     wallet.checkFund -= amount;
//     await wallet.save();

//     await newWalletHistory.save();

//     const checkNotification = new Notification({
//       userId: user._id,
//       userRole: user.role,
//       transactionId: wallet._id, // Ensure this is a string
//       message: `Request sent for withdrawal to admin: ${amount}`,
//       readStatus: false,
//     });
//     await checkNotification.save();

//     return NextResponse.json({ message: 'Withdrawal request sent successfully', wallet }, { status: 200 });
//   } catch (error) {
//     console.error('Error requesting withdrawal:', error);
//     return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
//   }
// }
