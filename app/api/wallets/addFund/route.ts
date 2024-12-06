// app/api/wallet/addFund/route.ts
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
  //  console.log(user._id);
  console.log(user.role);
  
    const wallet = await Wallet.findById(user.wallet);
    if (!wallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
    }
    // console.log(wallet._id);

    // Create a pending transaction in WalletHistory for admin approval
    const newWalletHistory = await WalletHistory.create({
      // walletId: wallet._id,
      userId: user._id,
      transactionType: 'credit',
      amount,
      balanceAfterTransaction: wallet.checkFund + amount, // Projected balance after approval
      transactionDate: new Date(),
      approvalStatus: 'pending' // New field to track admin approval
    });

    // Notify user of pending status
    
    const walletNotification = new Notification({
      userId: user,
      userRole: user.role,
      transactionId: newWalletHistory._id,
      message: `Fund request of amount ${amount} is pending admin approval.`,
      readStatus: false
    });
    await walletNotification.save();

    // Notify admin of the new fund request
    // const adminNotification = new Notification({
    //   userId: user, // Use a predefined admin identifier
    //   userRole: user.role,
    //   transactionId: newWalletHistory._id,
    //   message: `User ${username} has requested to add funds of amount ${amount}.`,
    //   readStatus: false,
    // });
    // await adminNotification.save();

    return NextResponse.json(
      { message: `Fund request is pending admin approval`},
      { status: 200 }
    );
  } catch (error) {
    console.error('Error adding funds:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred' },
      { status: 500 }
    );
  }
}




// // app/api/wallet/addFund/route.ts
// import { NextResponse } from 'next/server';
// import dbConnect from '@/lib/connectDb';
// import Wallet from '@/models/Wallet';
// import User from '@/models/Users';
// import Notification from '@/models/Notification';
// import WalletHistory from '@/models/WalletHistory';


// export async function POST(req: Request) {
 
//   try {
//     await dbConnect();
//     const { username, amount } = await req.json();

//     if (!username || typeof amount !== 'number' || amount <= 0) {
//       return NextResponse.json(
//         { error: 'Invalid request. Provide a valid username and a positive amount.' },
//         { status: 400 }
//       );
//     }

//     // Find user and wallet
//     const user = await User.findOne({ username });
//     if (!user) {
//       return NextResponse.json({ error: 'User not found' }, { status: 404 });
//     }

//     const wallet = await Wallet.findById(user.wallet);
//     if (!wallet) {
//       return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
//     }

//     // Add funds
//     wallet.addFund += amount;

//     const walletNotification = new Notification({
//       userId: user,
//       message: `Ammount added Successfully: ${amount}`,
//       readStatus: false
//     })
//     await walletNotification.save();

//     await wallet.save();
//     wallet.checkFund += amount;
//     await wallet.save();

//     const newWalletHistory = await WalletHistory.create({
//       walletId: wallet._id,
//       transactionType: 'credit',
//       amount,
//       balanceAfterTransaction: wallet.checkFund, // Updated balance after withdrawal
//       transactionDate: new Date(),
//     })

//     await newWalletHistory.save();

//     return NextResponse.json({ message: 'Funds added successfully', wallet }, { status: 200 });
//   } catch (error) {
//     console.error('Error adding funds:', error);
//     return NextResponse.json(
//       { error: 'An internal server error occurred' },
//       { status: 500 }
//     );
//   }
// }