import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/connectDb";
import Notification from "@/models/Notification";

// GET: Fetch notifications for a specific user
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
    const userId = params.id;

    try {
        const notification = await Notification.find({ userId: userId }).sort({createdAt: -1});
        return NextResponse.json({ notification: notification }, { status: 200 });
    } catch (error) {
        console.error("Failed to get the notifications!", error);
        return NextResponse.json(
            { message: "Failed to get the notifications!" },
            { status: 500 }
        );
    }
}

// PATCH: Mark notifications as read for a specific user
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
    const userId = params.id;

    try {
        await Notification.updateMany({ userId, readStatus: false }, { readStatus: true });
        return NextResponse.json({ message: "Notifications marked as read!" }, { status: 200 });
    } catch (error) {
        console.error("Failed to update notifications!", error);
        return NextResponse.json(
            { message: "Failed to update notifications!" },
            { status: 500 }
        );
    }
}

// DELETE: Delete a specific notification by ID
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
    const notificationId = params.id;

    try {
        const deletedNotification = await Notification.findByIdAndDelete(notificationId);

        if (!deletedNotification) {
            return NextResponse.json(
                { message: "Notification not found!" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Notification deleted successfully!" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Failed to delete the notification!", error);
        return NextResponse.json(
            { message: "Failed to delete the notification!" },
            { status: 500 }
        );
    }
}

