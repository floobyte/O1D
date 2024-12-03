// app/api/users/block/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDb from '@/lib/connectDb';
import User from '@/models/Users';
import { authMiddleware } from '@/middleware/authMiddleware';

export async function POST(req: NextRequest) {
    const authResult = await authMiddleware(req, ['admin']);

    if(authResult){
        return authResult;
    }

  try {
    await connectDb();

    const { userId, block } = await req.json();

    if (!userId || typeof block !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid data. Provide userId and block status.' },
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { blocked: block },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const action = block ? 'blocked' : 'unblocked';
    return NextResponse.json({
      message: `User has been successfully ${action}.`,
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error blocking/unblocking user:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
