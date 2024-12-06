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


export async function POST(req: NextRequest){

    await dbConnect();
    const { token,newPassword } = await req.json();

    try {
     
        const user = await User.findOne({
            resetToken: token,
            // resetTokenExpiry: { $gt: Date.now() },
        });
        console.log({user})

        if(!user){
            return NextResponse.json({ message: 'Invalid or expired token'},{ status: 404})
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password and reset the token

        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;

        await user.save();

        return NextResponse.json({message: "Password reset Succesfully!"}, {status: 200})
        
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error reseting password!'},{ status: 500})
    }
}