// import { NextResponse } from 'next/server';
// import dbConnect from '@/lib/connectDb';
// import Wallet from '@/models/Wallet';
// import WalletHistory from '@/models/WalletHistory';
// import Notification from '@/models/Notification';
// import { authMiddleware } from '@/middleware/authMiddleware';

// export async function POST(req: Request) {
//   const authResult = await authMiddleware(req, ['admin']);
//   if (authResult) {
//     return authResult;
//   }

//   try {
//     await dbConnect();
//     const { walletId, action } = await req.json();

//     if (!walletId || !['approve', 'reject'].includes(action)) {
//       return NextResponse.json(
//         { error: 'Invalid request. Provide a valid walletId and action (approve/reject).' },
//         { status: 400 }
//       );
//     }

//     // Find wallet by walletId
//     const wallet = await Wallet.findById(walletId);
//     if (!wallet) {
//       return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
//     }

//     // Find pending transaction in WalletHistory for the wallet
//     const transaction = await WalletHistory.findOne({ walletId: wallet._id, approvalStatus: 'pending' });
//     if (!transaction) {
//       return NextResponse.json({ error: 'No pending transactions found' }, { status: 404 });
//     }

//     console.log(transaction.userId);

//     if (action === 'approve') {
//       // Approve and add funds to the wallet
//       wallet.addFund += transaction.amount;
//       wallet.checkFund += transaction.amount;
//       await wallet.save();

//       // Update transaction status
//       transaction.approvalStatus = 'approved';
//       transaction.balanceAfterTransaction = wallet.checkFund;
//       await transaction.save();

//       // Notify user of fund approval
//       const notification = new Notification({
//         userId: transaction.userId, // Assuming Wallet model has a `userId` field
//         transactionId: transaction._id,
//         message: `Your fund request of amount ${transaction.amount} has been approved.`,
//         readStatus: false,
//       });
//       await notification.save();

//       return NextResponse.json(
//         { message: 'Transaction approved and funds added to wallet' },
//         { status: 200 }
//       );
//     } else if (action === 'reject') {
//       // Reject the transaction
//       transaction.approvalStatus = 'rejected';
//       await transaction.save();

//       // Notify user of fund rejection
//       const notification = new Notification({
//         userId: transaction.userId, // Assuming Wallet model has a `userId` field
//         transactionId: transaction._id,
//         message: `Your fund request of amount ${transaction.amount} was rejected.`,
//         readStatus: false,
//       });
//       await notification.save();

//       return NextResponse.json({ message: 'Transaction rejected' }, { status: 200 });
//     }
//   } catch (error) {
//     console.error('Error processing approval:', error);
//     return NextResponse.json(
//       { error: 'An internal server error occurred admin' },
//       { status: 500 }
//     );
//   }
// }





// app/api/wallet/approveFund/route.ts
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
    const { transactionId, action } = await req.json();
    // console.log({transactionId});

    if (!transactionId || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid request. Provide a valid transaction ID and action (approve/reject).' },
        { status: 400 }
      );
    }

    // Find the transaction in WalletHistory
    const transaction = await WalletHistory.findById(new mongoose.Types.ObjectId(transactionId.toString())).populate('walletId');
    console.log({transaction});
    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // Check if transaction is already processed
    if (transaction.approvalStatus !== 'pending') {
      return NextResponse.json(
        { message: 'Transaction has already been processed' },
        { status: 400 }
      );
    }

    if (action === 'approve') {
      // Approve and add funds to the wallet
      const wallet = await Wallet.findById(transaction.walletId._id);
        console.log({wallet});
      if (!wallet) {
        return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
      }

      // Update wallet funds
      wallet.addFund += transaction.amount;
      wallet.checkFund += transaction.amount;
      //   console.log("hare2");
      await wallet.save();
      //   console.log("Hare");

      // Update transaction status to approved
      transaction.approvalStatus = 'approved';
      transaction.balanceAfterTransaction = wallet.checkFund; // Update balance
      await transaction.save();



      // Notify user of successful fund addition
      // Find the associated Notification to get userId
      const notification = await Notification.findOne({ transactionId: transaction._id });
       console.log({notification});
      if (!notification) {
        return NextResponse.json({ error: 'Notification not found for this transaction' }, { status: 404 });
      }

      const userId = notification.userId; // Get the userId from the existing notification
       console.log({userId}); 


      // Create a new notification for the user

      const notificationProcess = new Notification({
        userId: userId, // Use the 'userId' from the Notification
        transactionId: transactionId,
        message: `Your fund request of amount ${transaction.amount} Processing....`,
        readStatus: false
      });
      await notificationProcess.save();

      const delayNotification = 10000;

      setTimeout(async () => {
        try {
          const notificationApproved = new Notification({
            userId: userId, // Use the 'userId' from the Notification
            transactionId: transactionId,
            message: `Your fund request of amount ${transaction.amount} has been approved.`,
            readStatus: false
          });

          await notificationApproved.save();
        } catch (error) {
          console.error("Error while saving notification:", error);
        }
      }, delayNotification)

      return NextResponse.json({ message: 'Transaction approved and funds added to wallet' }, { status: 200 });

    } else if (action === 'reject') {
      // Reject the transaction
      transaction.approvalStatus = 'rejected';
      await transaction.save();
      console.log("Hello");

      // Notify user of rejection
      const notification = await Notification.findOne({ transactionId: transaction._id });
      //  console.log({notification});
      if (!notification) {
        return NextResponse.json({ error: 'Notification not found for this transaction' }, { status: 404 });
      }

      const userId = notification.userId;
      const notificationReject = new Notification({
        userId: userId, // Use the 'userId' from the Notification
        transactionId: transactionId,
        message: `Your fund request of amount ${transaction.amount} was rejected.`,
        readStatus: false
      });
      await notificationReject.save();


      return NextResponse.json({ message: 'Transaction rejected' }, { status: 200 });
    }
  } catch (error) {
    console.error('Error processing approval:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred admin' },
      { status: 500 }
    );
  }
}
