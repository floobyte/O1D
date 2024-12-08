// src/components/Notifications.tsx

import React, { useState, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import { useAuthContext } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

interface Notification {
  dailyEarning: string;
  rentalProduct: string;
  approvewithDrawalReq: string;
  withDrawalReq: string;
  addFundReq: string;
  approveFundReq: string;
  _id: string;
  userId: string;
  message: string;
  readStatus: boolean;
  createdAt: string;
}

const Notifications = () => {
  const { userId } = useAuthContext();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const router = useRouter();

  // Fetch Notifications
  useEffect(() => {
    if (!userId) return;
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`/api/notifications/${userId}`, {
          method: "GET",
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setNotifications(data.notification || []);
        } else {
          console.error("Failed to fetch notifications");
        }
      } catch (error) {
        console.error("Error fetching the notifications!", error);
      }
    };
    fetchNotifications();
  }, [userId]);

  const unreadCount = notifications.filter(
    (notification) => !notification.readStatus
  ).length;

  const markNotificationsAsRead = async () => {
    try {
      const response = await fetch(`/api/notifications/${userId}`, {
        method: "PATCH",
        credentials: "include",
      });
      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notification) => ({ ...notification, readStatus: true }))
        );
      } else {
        console.error("Failed to mark notifications as read");
      }
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  const removeNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setNotifications((prev) =>
          prev.filter((notification) => notification._id !== notificationId)
        );
      } else {
        console.error("Failed to delete notification!");
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      const response = await fetch(`/api/notifications/clearall/${userId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setNotifications([]);
      } else {
        console.error("Failed to clear notifications!");
      }
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };

  const handleToggleNotifications = () => {
    if (!showNotifications) markNotificationsAsRead();
    setShowNotifications(!showNotifications);
  };


  const goWalletHistory = () => {
    router.push('/wallet/wallethistory');
  }


  const goOrders = () => {
    router.push('/rentalhistory');
  }

  return (
    <div className="relative">
      <button
        className="relative hover:text-gray-400"
        onClick={handleToggleNotifications}
      >
        <FaBell />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1">
            {unreadCount}
          </span>
        )}
      </button>
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-72 bg-white text-black rounded-md shadow-lg overflow-hidden z-20">
          <ul className="max-h-60 overflow-auto">
            {notifications.length > 0 ? (
              <>
                {notifications.map((notification) => (
                  <li
                    key={notification._id}
                    className="flex justify-between items-center p-4 text-sm border-b"
                  >
                    <div>
                      {
                      notification.addFundReq === 'addFundReq' ||  
                      notification.approveFundReq === "approveFundReq" ||
                      notification.approveFundReq === "approveRejected" ||
                      notification.withDrawalReq === "withDrawalReq" ||
                      notification.approvewithDrawalReq === "approvewithDrawalReq" ||
                      notification.dailyEarning === "dailyEarning" ||
                      notification.rentalProduct === "rentalProduct"
                        ? (
                          <button
                            onClick={() => goWalletHistory()}
                          >
                            <p>{notification.message}</p>
                          </button>
                        ) : (
                          <button
                            onClick={() => goOrders()}
                          >
                            <p>{notification.message}</p>
                          </button>
                        )}

                      {/* <p>{notification.message}</p> */}

                      <span className="text-xs text-gray-500">
                        {new Date(notification.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <button
                      className="text-red-500"
                      onClick={() => removeNotification(notification._id)}
                    >
                      X
                    </button>
                  </li>
                ))}
                <button
                  className="block w-full p-2 bg-red-600 text-white text-center"
                  onClick={clearAllNotifications}
                >
                  Clear All
                </button>
              </>
            ) : (
              <li className="p-4 text-center text-sm text-gray-500">
                No notifications
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Notifications;
