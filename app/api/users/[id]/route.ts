// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDb from '@/lib/connectDb';
import User from '@/models/Users';
import bcrypt from 'bcrypt';



// GET
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDb();
  const user = await User.findById(params.id);
  const id = params.id; 
  console.log({id});
  if (!user)
    return NextResponse.json(
      {
        error: 'User not found'
      },
      {
        status: 404
      })
      ;
  return NextResponse.json(user);
}



// Update
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  console.log("hello");
  await connectDb();
  const {
    name,
    email,
    dob,
    password,
    phone,
    username
  } = await req.json();

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const updatedUser = await User.findByIdAndUpdate(
   params.id, {
    name,
    email,
    dob,
    password: hashedPassword,
    phone,
    username
  },
    {
      new: true
    }
  );
  if (!updatedUser)
    return NextResponse.json(
      {
        error: 'User not found'
      },
      {
        status: 404
      }
    );
  return NextResponse.json(updatedUser);
}

// delete
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDb();
  const deletedUser = await User.findByIdAndDelete(params.id);
  if (!deletedUser) return NextResponse.json(
    {
      error: 'User not found'
    },
    {
      status: 404
    }

  );
  return NextResponse.json(deletedUser);
}
