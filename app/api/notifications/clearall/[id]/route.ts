// DELETE: Clear all notifications for a specific user
import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/connectDb";
import Notification from "@/models/Notification";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
    const userId = params.id;

    try {
        const result = await Notification.deleteMany({ userId });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { message: "No notifications to delete!" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "All notifications cleared successfully!" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Failed to clear notifications!", error);
        return NextResponse.json(
            { message: "Failed to clear notifications!" },
            { status: 500 }
        );
    }
}
