import { NextRequest, NextResponse } from 'next/server';
import connectDb from '@/lib/connectDb';
import User from '@/models/Users';
import { authMiddleware } from '@/middleware/authMiddleware';

export async function DELETE(req: NextRequest) {
  // Middleware to authenticate admin
  const authResult = await authMiddleware(req, ['admin']);

  if (authResult) {
    return authResult; // Return the response from authMiddleware if authentication fails
  }

  try {
    await connectDb();

    // Parse the JSON body
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Delete the user
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'User has been successfully deleted.',
      user: deletedUser,
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
