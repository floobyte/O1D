// app/api/users/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';
import User from '@/models/Users';
import Wallet from '@/models/Wallet';
import bcrypt from 'bcrypt';
// import { authMiddleware } from '@/middleware/authMiddleware';

// GET
export async function GET(req: Request) {
  // const middlewareResponse = await authMiddleware(req, ['admin']);

  // if(middlewareResponse){
  //   return middlewareResponse;
  // }
  
  await dbConnect();
  const users = await User.find({});
  // const userRole = users.filter(user => user.role === 'user' );
  return NextResponse.json(users);
  
}

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
