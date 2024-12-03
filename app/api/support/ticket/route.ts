import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';
import Support from '@/models/Support';
import User from '@/models/Users';
import { authMiddleware } from '@/middleware/authMiddleware';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
    // Authenticate user
    const authError = await authMiddleware(req, ['user']);
    if (authError) return authError;

    try {
        // Parse the incoming request body
        const { subjectLine, priority, category, userId } = await req.json();
        console.log(subjectLine,priority,category,userId);  
        // Check for required fields
        if (!subjectLine || !priority || !category) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await dbConnect();
        // Check if the user exists in the database by userId
        const user = await User.findById(userId);
        // console.log(user.name);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Create the support ticket and store the userId
        const ticket = await Support.create({
            userId,
            subjectLine,
            priority,
            category,
            ticketId: uuidv4(),
        });

        // Return a success response with the created ticket
        return NextResponse.json({ message: 'Support ticket created successfully', ticket }, { status: 201 });
    } catch (error) {
        console.error('Error creating support ticket:', error);
        return NextResponse.json({ error: 'Failed to create support ticket' }, { status: 500 });
    }
}


export async function GET(req: NextRequest) {
   
    // Authenticate user
    const authError = await authMiddleware(req, ['admin']);
    if (authError) return authError;

    try {
        await dbConnect();
        const tickets = await Support.find({}).sort({ createdAt: -1 });

        return NextResponse.json({ tickets }, { status: 200 });
    } catch (error) {
        console.error('Error fetching support tickets:', error);
        return NextResponse.json({ error: 'Failed to fetch support tickets' }, { status: 500 });
    }
}
