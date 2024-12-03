import { NextResponse, NextRequest } from 'next/server';
import connectDb from '@/lib/connectDb';
import RentalHistory from '@/models/RentalHistory';
// import mongoose from 'mongoose';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    await connectDb();

    const userId = params.id; // this should be a string representing the user's ID
    console.log(userId);

    try {
        // Convert userId to an ObjectId
        // const userObjectId = new mongoose.Types.ObjectId(userId);
        // console.log({userObjectId});

        // Now use userObjectId in the query instead of userId
        const rentalProducts = await RentalHistory.find({ user: userId });
        // console.log({rentalProducts});

        return NextResponse.json({rentalProducts: rentalProducts}, { status: 200 });
    } catch (error) {
        console.error('Error fetching rental products:', error);
        return new Response(JSON.stringify({ error: 'Invalid user ID format' }), { status: 400 });
    }
}