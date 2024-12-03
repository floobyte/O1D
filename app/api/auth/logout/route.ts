import { NextResponse } from "next/server";

export async function POST() {
    try {
        const res = NextResponse.json(
            { message: 'Logout successful' },
            { status: 200 }
        )
        res.cookies.set('token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            expires: new Date(0), // Set the cookie to expire immediately
        })

        return res;

    } catch (error) {
        console.error(`Error in Logout!`, error);
        return NextResponse.json(
            { error: `An internal server error occurred` },
            { status: 500 }
        );
    }
}