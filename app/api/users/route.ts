// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';
import User from '@/models/Users';
import Wallet from '@/models/Wallet';
import bcrypt from 'bcrypt';
// import { authMiddleware } from '@/middleware/authMiddleware';
import RentalHistory from "@/models/RentalHistory";
import WalletHistory from "@/models/WalletHistory";
// import { authMiddleware } from "@/middleware/authMiddleware";

export async function GET(req: NextRequest) {
  // Check if the user is an admin
  // const authResult = await authMiddleware(req, ["admin"]);
  // if (authResult) {
  //   return authResult; // Unauthorized response if not admin
  // }

  await dbConnect();

  try {
    // Fetch all users
    const users = await User.find({});
    const userStatuses = await Promise.all(
      users.map(async (user) => {
        const walletId = user.wallet;

        // Check active rentals
        const activeRental = await RentalHistory.findOne({
          user: user._id,
          rentDate: { $lte: new Date() },
          $expr: {
            $gt: [
              { $add: ["$rentDate", { $multiply: ["$rentalPeriod", 24 * 60 * 60 * 1000] }] },
              new Date(),
            ],
          },
        });

        // Check recent wallet transactions
        const recentTransaction = await WalletHistory.findOne({
          walletId: walletId,
          transactionType: "credited_daily_earning",
          transactionDate: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        });

        // Determine status
        const status = activeRental || recentTransaction ? "Active" : "Inactive";

        return {
          _id: user._id,
          name: user.name, // Assuming `name` is a field in the User model
          email: user.email, // Assuming `email` is a field in the User model
          username: user.username,
          phone: user.phone,
          role: user.role,
          account: user.account,
          IFSC: user.IFSC,
          status,
        };
      })
    );

    // Respond with the list of users and their statuses
    return NextResponse.json(userStatuses);
  } catch (error) {
    console.error("Error fetching user statuses:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}




// GET
// export async function GET(req: NextRequest) {
//   // const middlewareResponse = await authMiddleware(req, ['admin']);

//   // if(middlewareResponse){
//   //   return middlewareResponse;
//   // }
  
//   await dbConnect();
//   const users = await User.find({});
//   // const userRole = users.filter(user => user.role === 'user' );
//   return NextResponse.json(users);
  
// }

// POST
export async function POST(req: Request) {
  await dbConnect();
  
  try {
    const {
      name,
      email,
      password,
      confirmPass,
      dob,
      phone,
      username,
      account,
      IFSC,
      referralCode,
    } = await req.json();

    if (
      !name 
      || !email 
      || !dob 
      || !password 
      || !confirmPass 
      || !phone 
      || !username
      || !account
      || !IFSC
    ) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (password !== confirmPass) {
      return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username },{ phone }] });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email, username, phone already exists' },
        { status: 409 }
      );
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newWallet = await Wallet.create({});

    const isFirstUser = (await User.countDocuments({})) === 0;
    let role = 'user';

    // Step 3: Check if the user is the first one
    if (isFirstUser) {
      role = 'admin'; // Set first user as admin
    } else if (referralCode) {
      // Validate referral code for non-admin users
      const referrer = await User.findOne({ username: referralCode });
      if (!referrer) {
        return NextResponse.json(
          { error: 'Invalid referral code. User does not exist.' },
          { status: 400 }
        );
      }
      if (username === referralCode) {
        return NextResponse.json(
          { error: 'You cannot use your own username as a referral code.' },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: 'Referral code is required for new users' },
        { status: 400 }
      );
    }

    const newUser = new User({
      name,
      email,
      dob,
      password: hashedPassword,
      phone,
      username,
      account,
      IFSC,
      referralCode: username,
      wallet: newWallet._id,
      role,
    });

    // console.log({isFirstUser},{referralCode});

    if (!isFirstUser && referralCode) {
      const referrer = await User.findOne({ username: referralCode });
      newUser.referredBy = referrer?._id;
    }

    await newUser.save();
    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred' },
      { status: 500 }
    );
  }
}
