import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';
import Support from '@/models/Support';


interface CustomRequest extends NextRequest {
  user?: {
    role: string;
    id: string;
  };
}


export async function POST(req: NextRequest) {
  try {
    const { ticketId, message } = await req.json();

    if (!ticketId || !message || message.trim() === '') {
      return NextResponse.json(
        { error: 'Invalid input. ticketId and message are required.' },
        { status: 400 }
      );
    }

    const userRole = (req as CustomRequest).user?.role || 'user';
    const userId = (req as CustomRequest).user?.id || 'guest';

    await dbConnect();

    const ticket = await Support.findOne({ ticketId });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found.' }, { status: 404 });
    }

    const sender = userRole === 'admin' ? 'admin' : 'user';

    ticket.replies.push({
      sender,
      userId: sender === 'user' ? userId : undefined,
      message,
      timestamp: new Date(),
    });

    if (sender === 'admin') {
      ticket.status = 'answered';
    }

    await ticket.save();

    return NextResponse.json({ message: 'Reply added successfully.', ticket }, { status: 200 });
  } catch (error) {
    console.error('Error adding reply:', error);
    return NextResponse.json({ error: 'Failed to add reply.' }, { status: 500 });
  }
}
