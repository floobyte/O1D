import dbConnect from "@/lib/connectDb";
import User from "@/models/Users";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';


// export async function GET(req: NextRequest) {
//     await dbConnect();

  
//     try {
//         const user = await User.findOne({});
//         if (!user) {
//             return NextResponse.json({ message: 'User not found' }, { status: 404 });
//         }

//         const resetToken = user.resetToken;

//         return NextResponse.json({ resetToken }, { status: 200 });
//     } catch (error) {
//         console.error(error);
//         return NextResponse.json({ message: 'Error fetching reset token' }, { status: 500 });
//     }
// }


// import { NextRequest, NextResponse } from 'next/server';
// import bcrypt from 'bcrypt';
// import dbConnect from '@/lib/dbConnect'; // Ensure the correct path to your DB connection function
// import User from '@/models/User'; // Ensure the correct path to your User model


export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { token, password, confirmPassword } = await req.json();

    if (!password || !confirmPassword) {
      return NextResponse.json(
        { message: "Both password fields are required" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: "Passwords do not match" },
        { status: 400 }
      );
    }

    // Find the user with the reset token and check expiry
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Hash the new password and update the user record
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return NextResponse.json(
      { message: "Password has been reset successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error resetting password" },
      { status: 500 }
    );
  }
}
