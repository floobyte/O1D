"use client";

import { useEffect, useState } from "react";

interface Notification {
  _id: string;
  userId: string;
  message: string;
  readStatus: boolean;
  createdAt: string;
  __v: number;
}

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const eventSource = new EventSource("http://localhost:3000/api/notifications");

    eventSource.onmessage = (event) => {
      const newNotification = JSON.parse(event.data) as Notification;

      // Update state and sort by createdAt in descending order
      setNotifications((prev) => {
        const updatedNotifications = [newNotification, ...prev];
        return updatedNotifications.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
    };

    eventSource.onerror = () => {
      console.error("EventSource failed. Reconnecting...");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div>
      <h1>Notifications</h1>
      <ul>
        {notifications.map((notification) => (
          <li key={notification._id}>
            {notification.message} <small>({new Date(notification.createdAt).toLocaleString()})</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsPage;








// // app/notifications/page.tsx
// "use client";

// import { useEffect, useState } from "react";

// interface Notification {
//   message: string;
// }

// const NotificationsPage = () => {
//   const [notifications, setNotifications] = useState<Notification[]>([]);

//   useEffect(() => {
//     const eventSource = new EventSource("http://localhost:3000/api/notifications");

//     eventSource.onmessage = (event) => {
//       const newNotification = JSON.parse(event.data) as Notification;
//       setNotifications((prev) => [...prev, newNotification]);
//     };

//     eventSource.onerror = () => {
//       console.error("EventSource failed. Reconnecting...");
//       eventSource.close();
//     };

//     return () => {
//       eventSource.close();
//     };
//   }, []);

//   return (
//     <div>
//       <h1>Notifications</h1>
//       <ul>
//         {notifications.map((notification, index) => (
//           <li key={index}>{notification.message}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default NotificationsPage;
