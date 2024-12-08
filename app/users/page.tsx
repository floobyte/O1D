"use client";

import { useEffect, useState } from "react";
import { User } from "@/types";
import { fetchUsers } from "@/app/services/api";
import UserList from "@/app/components/UserList";
import SignUp from "@/app/auth/signUp/page";
import UserListWithSearch from "../components/UserListWithSearch";

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddFormVisible, setIsAddFormVisible] = useState<boolean>(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      console.log("Failed to load users",err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleAddUserClick = () => {
    setIsAddFormVisible(!isAddFormVisible);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {/* <UserList users={users} /> */}
      <UserListWithSearch users={users} />
      {/* Toggle Add User Form */}
     
      {isAddFormVisible && <SignUp onUserAdded={loadUsers} />}
    </div>
  );
};

export default UsersPage;
