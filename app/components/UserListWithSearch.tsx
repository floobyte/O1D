import React, { useState } from "react";
import UserList from "./UserList";
import { User } from "@/types";

interface UserListWithSearchProps {
  users: User[];
}

const UserListWithSearch: React.FC<UserListWithSearchProps> = ({ users }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter users based on the search term
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container  mx-auto p-6 mt-12 text-gray-700">
      <div className="flex justify-center mb-6 ">
        <input
          type="text"
          placeholder="Search users by name, username, or email"
          className="px-4 py-2 border rounded-md  w-4/6 sm:w-2/5 focus:outline-none focus:ring-2 focus:ring-purple-500 text-center"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <UserList users={filteredUsers} />
    </div>
  );
};

export default UserListWithSearch;
