// import { NextRequest, NextResponse } from 'next/server';
// import dbConnect from '@/lib/connectDb';
// import User from '@/models/Users';
// import Product from '@/models/ProductList';
// import Wallet from '@/models/Wallet';
// import RentalHistory from '@/models/RentalHistory';
// import Notification from '@/models/Notification';
// import WalletHistory from '@/models/WalletHistory';
// // import { authMiddleware } from '@/middleware/authMiddleware';

// let activeRentals: any[] = [];

// export async function GET(req: Request) {
//   await dbConnect();
//   try {
   
//     // MiddleWare
//     // const authResult = await authMiddleware(req, ['admin']);

//     // if (authResult) {
//     //   return authResult;
//     // }

//      // Use the lean for better performance
//     const rentalProduct = await RentalHistory.find({}).lean();
//     return NextResponse.json({ rentalProduct: rentalProduct }, { status: 200 });
//   } catch (error) {
//     console.log("Failed to fetch the rented product!", error);

//     return NextResponse.json(
//       { error: "Failed to fetch rental products" },
//       { status: 500 }
//     );
//   }

// }

// // Helper function to create a notification for each wallet history entry
// async function createWalletHistoryNotification(walletId: string,
//   transactionType: string,
//   amount: number,
//   userId: string
// ) {
//   const notificationMessage = `credit ${amount} DailyEarning Ammount.`;

//   const newNotification = new Notification({
//     userId: userId,
//     message: notificationMessage,
//   });

//   await newNotification.save();
// }

// // Rental handler function
// export async function POST(req: NextRequest) {
//   await dbConnect();

//   try {
//     const { userId, productId } = await req.json();
//     // console.log(userId,productId);
//     if (!userId || !productId) {
//       return NextResponse.json({ error: 'User ID and Product ID are required.' }, { status: 400 });
//     }

//     const user = await User.findById(userId).populate('wallet');
//     if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

//     const product = await Product.findById(productId);
//     if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

//     const wallet = await Wallet.findById(user.wallet);
//     if (!wallet) return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });

//     if (wallet.checkFund < product.rentAmount) {
//       return NextResponse.json({ error: 'Insufficient funds in wallet' }, { status: 400 });
//     }

//     wallet.checkFund -= product.rentAmount;
//     await wallet.save();

//     const amount = product.rentAmount;

//     // Add wallet history entry for deduction
//     const newWalletHistory = await WalletHistory.create({
//       walletId: wallet._id,
//       transactionType: 'debited',
//       amount,
//       balanceAfterTransaction: wallet.checkFund,
//       transactionDate: new Date(),
//     });
//     await newWalletHistory.save();

//     // Create notification for wallet history entry
//     await createWalletHistoryNotification(wallet._id, 'debited', amount, userId);

//     const dailyEarning = product.dailyEarning || 0;
//     const rentalPeriod = product.rentDays;

//     const newRental = await RentalHistory.create({
//       user: userId,
//       product: productId,
//       productName: product.productName,
//       wallet: wallet._id,
//       rentAmount: product.rentAmount,
//       rentalPeriod: rentalPeriod,
//       dailyEarning: dailyEarning,
//       lastEarningUpdate: new Date(),
//     });

//     activeRentals.push({
//       rentalId: newRental._id,
//       userId: userId,
//       productId: productId,
//       walletId: wallet._id,
//       dailyEarning: dailyEarning,
//       startTime: new Date(),
//       rentalPeriod,
//     });

//     const rentalNotification = new Notification({
//       userId: userId,
//       message: `You have successfully rented the product: ${product.productName}.`,
//       readStatus: false,
//     });
//     await rentalNotification.save();

//     newRental.isRented = true;
//     await newRental.save();


//     return NextResponse.json({ message: 'Product rented successfully', wallet, rentalHistory: newRental }, { status: 200 });
//   } catch (error) {
//     console.error('Error processing rental:', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }

// const intervalInMs = 10000;

// setInterval(async () => {
//   try {
//     await updateAllActiveRentals();
//   } catch (error) {
//     console.error("Error updating rentals:", error);
//   }
// }, intervalInMs);

// async function updateAllActiveRentals() {
//   const currentTime = new Date();

//   for (let i = activeRentals.length - 1; i >= 0; i--) {
//     const rental = activeRentals[i];
//     const timeElapsed = (currentTime.getTime() - rental.startTime.getTime()) / (1000 * 60 * 60 * 24);

//     if (timeElapsed <= rental.rentalPeriod) {
//       const wallet = await Wallet.findById(rental.walletId);
//       if (wallet) {
//         wallet.checkFund += rental.dailyEarning;
//         await wallet.save();

//         // Create wallet history entry for daily earning addition
//         const newEarningHistory = await WalletHistory.create({
//           walletId: wallet._id,
//           transactionType: 'credited_daily_earning',
//           amount: rental.dailyEarning,
//           balanceAfterTransaction: wallet.checkFund,
//           transactionDate: new Date(),
//         });
//         await newEarningHistory.save();

//         // Create notification for the daily earning transaction
//         await createWalletHistoryNotification(
//           wallet._id,
//           'credited_daily_earning',
//           rental.dailyEarning,
//           rental.userId
//         );
//       }
//     } else {
//       const expirationNotification = new Notification({
//         userId: rental.userId,
//         message: `Your rental for product ${rental.productId} has expired.`,
//         readStatus: false,
//       });
//       await expirationNotification.save();
//       activeRentals.splice(i, 1);
//     }
//   }
// }
