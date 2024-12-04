import Notification from "@/models/Notification";
import dbConnect from '@/lib/connectDb';
import { NextResponse } from 'next/server';
import User from '@/models/Users';
import { authMiddleware } from "@/middleware/authMiddleware";


type userNotification = {
  userRole: string;
  [key: string]: unknown; // Add other fields as required
};

// GET: Fetch notifications for a specific user
// Add Fund Request Notification Get ByAdmin
export async function GET(req: Request) {
  const authResult = await authMiddleware(req, ['admin']);
  if (authResult) {
    return authResult;
  }

  await dbConnect();

  try {

    const notification:userNotification[] = await Notification.find({});

    // Define userNotifications array to store only users notifications
    const userNotifications: userNotification[] = [];

    notification.forEach(notifications => {

      if (notifications.userRole === 'user') {
        console.log(notifications.userRole);
        userNotifications.push(notifications);
      }

    })

    return NextResponse.json({ userNotifications: userNotifications }, { status: 200 });
  } catch (error) {
    console.error("Failed to get the notifications!", error);
    return NextResponse.json(
      { message: "Failed to get the notifications!" },
      { status: 500 }
    );
  }
}



export async function POST(req: Request) {

  const authResult = await authMiddleware(req, ['admin']);
  if (authResult) {
    return authResult;
  }

  await dbConnect();
  const { username } = await req.json();
  // console.log({username});
  if (!username) {
    return NextResponse.json(
      { error: 'Invalid request. Provide a valiyd username' },
      { status: 400 }
    );
  }

  const user = await User.findOne({ username });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const walletNotification = new Notification({
    userId: user,
    message: `Site is under the mantinence`,
    readStatus: false
  })
  await walletNotification.save();

  return NextResponse.json({ message: 'Notification send to all users' }, { status: 200 });
}