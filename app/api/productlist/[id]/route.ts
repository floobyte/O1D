import { NextRequest, NextResponse } from 'next/server';
import connectDb from '@/lib/connectDb';
import Product from '@/models/ProductList';
import { authMiddleware } from '@/middleware/authMiddleware';

// GET Product
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDb();
  const rental = await Product.findById(params.id);
  if (!rental) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  return NextResponse.json(rental);
}

// Update Product
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDb();

  const authResponse = await authMiddleware(req, ['admin']);
  if (authResponse) {
    return authResponse;
  }

  const {
    productName,
    rentAmount,
    rentDays,
    dailyEarning,
    offerTiming,
    buyAmount
  } = await req.json();

  const updatedRental = await Product.findByIdAndUpdate(params.id, {
    productName,
    rentAmount,
    rentDays,
    dailyEarning,
    offerTiming,
    buyAmount
  },
    { new: true }
  );
  if (!updatedRental)
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  return NextResponse.json(updatedRental);
}

// DELETE Product
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDb();

  const authResponse = await authMiddleware(req, ['admin']);
  if (authResponse) {
    return authResponse;
  }

  const deletedRental = await Product.findByIdAndDelete(params.id);
  if (!deletedRental) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  return NextResponse.json(deletedRental);
}
