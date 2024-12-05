import dbConnect from "@/lib/connectDb";
import User from "@/models/Users";
import { NextRequest, NextResponse } from "next/server";
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {

    // Connect to DB

    await dbConnect();

    try {

        //1. Find user from the Database
        const { email } = await req.json();
        const user = await User.findOne({ email });
        console.log({ user });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 })
        }

        // 2.Generate a Random Reset Token
        const token = crypto.randomBytes(32).toString('hex');
        console.log({token});
        const expiry = Date.now() + 360000 //1hour;
        console.log({expiry});

        //Update user with reset Token
        user.resetToken = token;
        user.resetTokenExpiry = expiry;
        console.log({ user });

        user.save();

        const resetUrl = `${process.env.URL_O1D}/api/auth/reset-password?token=${token}`;
        console.log({resetUrl});
        
        // Send email
        const transporter = nodemailer.createTransport({
            host: 'smtp.hostinger.com',
            port: 465,
            auth: {
                user: 'test@floobyte.com',
                pass: 'arvindTest@123'
            },
            logger: true, // Enable logging
            debug: true,  // Include debug output
        })

        console.log({transporter});


        await transporter.sendMail({
            to: 'thakursingharvindji1999@gmail.com',
            from: 'test@floobyte.com',
            subject: 'Password Reset',
            html: `
              <p>You requested a password reset.</p>
              <p>Click this <a href="${resetUrl}">link</a> to reset your password. This link will expire in 1 hour.</p>
            `,
        })


        return NextResponse.json({ message: 'Email Sent to user Successfully!' }, { status: 200 })

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error Processing Request' }, { status: 500 })
    }


}