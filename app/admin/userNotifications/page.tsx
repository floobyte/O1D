"use client";
import React from "react";
import UserRequestAddFund from "@/app/components/admin/UserRequestAddFund";

const UserNotificationsPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center py-4 mt-12 m-4">
      <div className="w-full max-w-4xl bg-slate-900 p-5 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-white mb-6">
          User Requests
        </h1>
        {/* Directly render the UserRequestAddFund component */}
        <div className="mt-6">
          <UserRequestAddFund />
        </div>
      </div>
    </div>
  );
};

export default UserNotificationsPage;
