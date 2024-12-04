import React, { useEffect, useState } from "react";
import { User } from "@/types"; // Import User type from types.ts
import { useAuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import UpdateUserPopUp from "./UpdateUserPopUp";

interface UserListProps {
  users: User[];
}

const UserList: React.FC<UserListProps> = ({ users }) => {
  const { userId, userRole } = useAuthContext();
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [responseMessage, setResponseMessage] = useState<string>("");
  // const [removedUserId, setRemovedUserId] = useState<string>("");

  // Effect to filter and sort users based on roles
  useEffect(() => {
    const sortedUsers = [...users].sort((a, b) => {
      if (a.role === "admin" && b.role !== "admin") return -1;
      if (a.role !== "admin" && b.role === "admin") return 1;
      return 0;
    });

    if (userRole === "admin") {
      setFilteredUsers(sortedUsers);
    } else if (userRole === "user" && userId) {
      const userProfile = sortedUsers.filter((user) => user._id === userId);
      setFilteredUsers(userProfile);
    }
  }, [userRole, userId, users]);

  // Function to handle blocking a user
  const handleBlockUser = async (id: string, block: boolean) => {
    try {
      setResponseMessage(""); // Clear previous messages
      const response = await fetch("/api/users/block", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: id, block }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to process request");
      }

      setResponseMessage(result.message);

      // Update local user list
      setFilteredUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? { ...user, blocked: block } : user
        )
      );
    } catch (error) {
      console.log("User not found",error);
      setResponseMessage("User not found");
    }
  };

  // Function to handle removing a user
  const handleRemove = async (id: string) => {
    try {
      const response = await fetch("/api/users/remove", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: id }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to delete user");
      }

      setResponseMessage(result.message);
      // setRemovedUserId(id);

      // Remove the user from the local state
      setFilteredUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
      setResponseMessage("Failed to delete user.");
    }
  };

  return (
    <div className="container mx-auto p-6 mt-8 mb-20">
      <h1 className="text-4xl font-extrabold text-center text-gradient bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent mb-10">
        Profile
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <motion.div
              key={user._id}
              whileHover={{ scale: 1.05, translateY: -10 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="relative dark:bg-slate-950 border border-gray-200 rounded-lg shadow-lg p-6 hover:shadow-2xl transition-all duration-300 ease-in-out text-white"
            >
              {user.role === "admin" && (
                <span className="absolute top-4 right-4 px-3 py-1 text-xs font-bold bg-purple-500 text-white rounded-md">
                  Admin
                </span>
              )}

              <div className="flex justify-center mb-4">
                <motion.img
                  src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
                  alt="User Avatar"
                  className="w-20 h-20 rounded-full border-4 border-purple-500"
                  whileHover={{ rotate: 15 }}
                  transition={{ type: "spring", stiffness: 200 }}
                />
              </div>

              <div className="text-center space-y-2 text-white">
                <h2 className="text-lg font-semibold">Name: {user.name || "N/A"}</h2>
                <p className="text-sm">Username: {user.username || "N/A"}</p>
                <p className="text-sm">Email: {user.email || "N/A"}</p>
                <p className="text-sm">Phone: {user.phone || "N/A"}</p>
                <p className="text-sm">A/C: {user.account || "N/A"}</p>
                <p className="text-sm">IFSC: {user.IFSC || "N/A"}</p>
              </div>

              {userId === user._id && (
                <div className="mt-6 flex justify-center">
                  <motion.button
                    onClick={() => setShowPopup(true)}
                    whileHover={{ backgroundColor: "rgba(128, 0, 128, 0.9)", scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-medium rounded-md shadow hover:shadow-lg"
                  >
                    Update Profile
                  </motion.button>
                  {showPopup && (
                    <UpdateUserPopUp
                      id={userId}
                      onClose={() => setShowPopup(false)}
                    />
                  )}
                </div>
              )}

              <div className="flex justify-center gap-2">
                {!(userId === user._id || userRole === "user") && (
                  <>
                    <motion.button
                      onClick={() => handleBlockUser(user._id, !user.blocked)}
                      whileHover={{ backgroundColor: "", scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="px-4 py-2 bg-yellow-500 text-white font-medium rounded-md shadow hover:shadow-lg"
                    >
                      {user.blocked ? "Unblock" : "Block"}
                    </motion.button>
                    <motion.button
                      onClick={() => handleRemove(user._id)}
                      whileHover={{ backgroundColor: "rgba(255, 0, 0, 0.9)", scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="px-4 py-2 bg-red-500 text-white font-medium rounded-md shadow hover:shadow-lg"
                    >
                      Delete
                    </motion.button>
                  </>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full">
            No users found.
          </p>
        )}
      </div>

      {responseMessage && (
        <p className="text-center mt-4 text-lg text-green-500">{responseMessage}</p>
      )}
    </div>
  );
};

export default UserList;
