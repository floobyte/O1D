import { NextResponse } from "next/server";
import dbConnect from "@/lib/connectDb";
import Product from "@/models/ProductList";
// import User from "@/models/Users";
// import { authMiddleware } from "@/middleware/authMiddleware";
// Get Rentals

export async function GET() {
  await dbConnect();

  try {
    const products = await Product.find({});
    return NextResponse.json({ products }, { status: 200 });

  } catch (error) {
    console.error("Error fetching rentals: ", error);
  }
}


// Create Rentals
export async function POST(req: Request) {
  await dbConnect();

  // const authResult = await authMiddleware(req, ['admin']);
  // if (authResult) {
  //   return authResult;
  // }

  try {
    const {
      productName,
      rentAmount,
      rentDays,
      dailyEarning,
      offerTiming,
      totalEarning,
      buyAmount
    } = await req.json();

    //   check for required Fields

    if (
      !productName ||
      !rentAmount ||
      !rentDays ||
      !dailyEarning ||
      !offerTiming ||
      !totalEarning ||
      !buyAmount
    ) {
      return NextResponse.json(
        { error: 'All fields, including the referral code, are required' },
        { status: 400 }
      )
    }

    // verify if user exists using the referral code

    // const user = await User.findOne({ referralCode: userReferralCode });

    // if(!user){
    //   return NextResponse.json(
    //     { error: 'User not found with the provided referral code. Please register before creating a rental.' },
    //     { status: 400 }
    //   );
    // }

    // Create new Rental entry with userId

    const newRental = await Product.create({
      productName,
      rentAmount,
      rentDays,
      dailyEarning,
      offerTiming,
      totalEarning,
      buyAmount
    });

    return NextResponse.json(newRental, { status: 201 });

  } catch (error) {
    console.error('Error creating rental: ', error);

    return NextResponse.json(
      { error: 'failed to create rental' },
      { status: 500 }
    );
  }

}







// import { NextResponse } from 'next/server';
// import dbConnect from '@/lib/connectDb';
// import Rental from '@/models/Rentals';
// import User from '@/models/Users';

// export async function GET() {
//   await dbConnect();
//   try {
//     const rentals = await Rental.find({}).populate('userId', 'name email');
//     return NextResponse.json(rentals);
//   } catch (error) {
//     console.error('Error fetching rentals:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch rentals' },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(req: Request) {
//   await dbConnect();

//   try {
//     const {
//       productName,
//       rentAmount,
//       rentDays,
//       dailyEarning,
//       offerTiming,
//       totalEarning,
//       userReferralCode,
//       buyAmount,
//     } = await req.json();

//     // Check for required fields
//     if (
//       !productName ||
//       !rentAmount ||
//       !rentDays ||
//       !dailyEarning ||
//       !offerTiming ||
//       !totalEarning ||
//       !buyAmount ||
//       !userReferralCode
//     ) {
//       return NextResponse.json(
//         { error: 'All fields, including the referral code, are required' },
//         { status: 400 }
//       );
//     }

//     // Verify if user exists using the referral code
//     const user = await User.findOne({ referralCode: userReferralCode });
//     if (!user) {
//       return NextResponse.json(
//         { error: 'User not found with the provided referral code. Please register before creating a rental.' },
//         { status: 400 }
//       );
//     }

//     // Create new Rental entry with userId
//     const newRental = await Rental.create({
//       userId: user._id, // Associate rental with the user's ID
//       productName,
//       rentAmount,
//       rentDays,
//       dailyEarning,
//       offerTiming,
//       totalEarning,
//       buyAmount,
//       userReferralCode,
//     });

//     return NextResponse.json(newRental, { status: 201 });
//   } catch (error) {
//     console.error('Error creating rental:', error);
//     return NextResponse.json(
//       { error: 'Failed to create rental' },
//       { status: 500 }
//     );
//   }
// }
