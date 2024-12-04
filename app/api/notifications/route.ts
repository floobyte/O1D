// import { NextResponse } from 'next/server';

export async function GET() {
  const encoder = new TextEncoder();
  let isControllerClosed = false; // Flag to check if the stream is closed

  const stream = new ReadableStream({
    start(controller) {
      function sendNotification() {
        if (isControllerClosed) return; // Only enqueue if controller is open
        const message = JSON.stringify({ message: "Hello! You have a new notification!" });
        controller.enqueue(encoder.encode(`data: ${message}\n\n`));
      }

      // Send a notification every 5 seconds as an example
      sendNotification();
      const intervalId = setInterval(sendNotification, 5000);

      // When the stream is closed, clear the interval and set the closed flag
      controller.close = () => {
        isControllerClosed = true;
        clearInterval(intervalId);
      };
    },
    cancel() {
      // This is called if the stream is canceled early (like if the client disconnects)
      isControllerClosed = true;
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
