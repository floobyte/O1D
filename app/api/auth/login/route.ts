import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';
import User from '@/models/Users';
import bcrypt from 'bcrypt';
import { generateToken } from '@/utils/generateToken';
import { setTokenCookie } from '@/utils/cookies';  

export async function POST(req: Request) {
  try {
    // Connect to the database
    await dbConnect();

    // Destructure the email/username and password from the request body
    const { email, password } = await req.json();
    console.log("Backend:", email, password);

    // Ensure both fields are present
    if (!email || !password) {
      return NextResponse.json({ error: 'Email/Username and password are required' }, { status: 400 });
    }

    // Find the user by either email or username
    const user = await User.findOne({
      $or: [{ email: email }, { username: email }]
    }).populate('wallet');  // Populating the wallet field to get the wallet data

    // If user is not found, return an error response
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

 
    // Blocked User
    if(user.blocked === true){
      return NextResponse.json({ error: "Your account has been blocked by the admin." }, { status: 403 });
    }

    // Compare the entered password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Generate a success response, including wallet ID and token
    const token = generateToken(user.role);
    // console.log({token});
    const res = NextResponse.json(
      {
        message: 'Login successful',
        user: {
          id: user._id,
          token: token,
          walletId: user.wallet ? user.wallet._id : null,  // Ensure wallet is populated
          userName: user.username,
          name: user.name,
          role: user.role,
          email: user.email,
          blocked: user.blocked
        }
      },
      { status: 200 }
    );

    // Set the token in the cookie
    setTokenCookie(res, token, user.role);

    // Return the response
    return res;

  } catch (error) {
    console.error('Error logging in user:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred' },
      { status: 500 }
    );
  }
}
