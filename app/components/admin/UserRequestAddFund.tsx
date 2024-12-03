"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface Notification {
  _id: string;
  userRole: string;
  transactionId: string;
  message?: string;
}

const UserRequestAddFund: React.FC = () => {
  const [userNotifications, setUserNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedTransactionId, setCopiedTransactionId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsersNotifications = async () => {
      try {
        const res = await fetch("/api/admin/notificationbyadmin", {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setUserNotifications(data.userNotifications || []);
        } else {
          setError("Failed to fetch notifications");
        }
      } catch (error) {
        console.error("Error fetching notifications", error);
        setError("An error occurred while fetching notifications.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsersNotifications();
  }, []);

  const handleCopyTransactionId = (transactionId: string) => {
    navigator.clipboard.writeText(transactionId).then(() => {
      setCopiedTransactionId(transactionId);
      setTimeout(() => setCopiedTransactionId(null), 2000);
    });
  };

  const removeNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setUserNotifications((prev) =>
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
      const response = await fetch(`/api/notifications/clearall`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setUserNotifications([]);
      } else {
        console.error("Failed to clear notifications!");
      }
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };

  return (
    <div className="h-1/2 flex items-center justify-center py-4 mt-4 sm:m-4 ">
      <div className="w-full max-w-4xl  rounded-lg shadow-md">
        {loading && <p className="text-gray-600">Loading notifications...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {userNotifications.length > 0 ? (
          <>
            <ul className="space-y-4">
              {userNotifications.map((notification) => (
                <li
                  key={notification._id}
                  className="p-4 border border-gray-300 rounded-lg bg-gray-100 flex flex-col gap-2 relative"
                >
                  <Link href="/wallet">
                    <div>
                      <p className="text-lg font-semibold text-gray-700">
                        Role: <span className="text-blue-600">{notification.userRole}</span>
                      </p>
                      {notification.message && (
                        <p className="text-gray-600 mt-1">Message: {notification.message}</p>
                      )}
                      <div className="relative text-lg font-semibold text-gray-700">
                        <p>
                          Transaction ID:{" "}
                          <span className="text-blue-600">{notification.transactionId}</span>
                        </p>
                        <button
                          className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                          onClick={(e) => {
                            e.preventDefault();
                            handleCopyTransactionId(notification.transactionId);
                          }}
                        >
                          Click to copy
                        </button>
                      </div>
                      {copiedTransactionId === notification.transactionId && (
                        <p className="text-green-600 text-sm mt-1">
                          Transaction ID copied to clipboard!
                        </p>
                      )}
                    </div>
                  </Link>
                  <button
                    className="absolute bottom-2 right-2 text-sm text-red-500 hover:underline"
                    onClick={() => removeNotification(notification._id)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <button
              className="block w-full p-2 bg-red-600 text-white text-center mt-4 rounded"
              onClick={clearAllNotifications}
            >
              Clear All
            </button>
          </>
        ) : (
          !loading && <p className="text-gray-600">No notifications found.</p>
        )}
      </div>
    </div>
  );
};

export default UserRequestAddFund;
