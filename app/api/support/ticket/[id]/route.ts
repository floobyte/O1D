import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';
import Support from '@/models/Support';
import { authMiddleware } from '@/middleware/authMiddleware';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const userId = params.id; // this should be a string representing the user's ID
    console.log(userId);

    // Authenticate user
    const authError = await authMiddleware(req, ['user']);
    if (authError) return authError;

    try {
        await dbConnect();
        const tickets = await Support.find({ userId:userId }).sort({ createdAt: -1 });

        return NextResponse.json({ tickets }, { status: 200 });
    } catch (error) {
        console.error('Error fetching support tickets:', error);
        return NextResponse.json({ error: 'Failed to fetch support tickets' }, { status: 500 });
    }
}
