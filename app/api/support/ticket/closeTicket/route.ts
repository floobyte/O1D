// app/api/support/ticket/close/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';
import Support from '@/models/Support';
import { authMiddleware } from '@/middleware/authMiddleware';

export async function DELETE(req: NextRequest) {
  // Authenticate user (user can close only their own tickets, admin can close any ticket)
  const authError = await authMiddleware(req, ['user', 'admin']);
  if (authError) return authError;

  try {
    // Get the userId from the request context or JWT
    const { ticketId } = await req.json();

    if (!ticketId) {
      return NextResponse.json({ error: 'ticketId is required' }, { status: 400 });
    }
    await dbConnect();
    // Find the ticket by userId (if the user is not an admin, they can only close their own ticket)
    const ticket = await Support.findOneAndDelete({ ticketId });
    console.log(ticket);
    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found for the given user' }, { status: 404 });
    }

    // // Check if the ticket is already closed
    // if (ticket.status === 'closed') {
    //   return NextResponse.json({ error: 'Ticket is already closed' }, { status: 400 });
    // }

    // // Update the ticket status to 'closed'
    // ticket.status = 'closed';

    return NextResponse.json({ message: 'Ticket closed successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error closing ticket:', error);
    return NextResponse.json({ error: 'Failed to close ticket' }, { status: 500 });
  }
}
