"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface UpdateUserProps {
  id: string | null;
  onClose: () => void;
  profileHeight?: number; // Accept profile height as a prop
}

const UpdateUserPopUp: React.FC<UpdateUserProps> = ({
  id,
  onClose,
  profileHeight,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    dob: "",
    phone: "",
    username: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Fetch user data when the popup is opened
  useEffect(() => {
    if (id) {
      const fetchUserData = async () => {
        try {
          const res = await fetch(`/api/users/${id}`);
          if (!res.ok) {
            throw new Error("Failed to fetch user data");
          }
          const data = await res.json();
          setFormData({
            name: data.name || "",
            email: data.email || "",
            password: "", // Don't show password for security
            dob: data.dob || "",
            phone: data.phone || "",
            username: data.username || "",
          });
        } catch (err) {
          setError("An error occurred while fetching user data.");
        }
      };

      fetchUserData();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) {
      setError("Invalid user ID");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || "Failed to update user");
        return;
      }

      toast({
        title: "User updated successfully",
        description: new Date().toString(),
      });

      setFormData({
        name: "",
        email: "",
        password: "",
        dob: "",
        phone: "",
        username: "",
      });

      onClose();
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      style={{
        height: profileHeight || "auto", // Use profile height or fallback to auto
      }}
    >
      <div
        className="relative w-full max-w-md p-4 sm:p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800 m-4"
        style={{ height: profileHeight || "auto" }} // Set the same height for the popup
      >
        <div className="flex items-center justify-between mb-4 border-b pb-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Update User
          </h2>
          <button
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 bg-red-500"
            onClick={onClose}
            aria-label="Close"
          >
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            name="name"
            value={formData.name}
            placeholder="Name"
            onChange={handleChange}
            className="w-full"
          />
          <Input
            type="email"
            name="email"
            value={formData.email}
            placeholder="Email"
            onChange={handleChange}
            className="w-full"
          />
          <Input
            type="password"
            name="password"
            value={formData.password}
            placeholder="New Password"
            onChange={handleChange}
            className="w-full"
          />
          <Input
            type="text"
            name="dob"
            value={formData.dob}
            placeholder="DOB"
            onChange={handleChange}
            className="w-full"
          />
          <Input
            type="text"
            name="phone"
            value={formData.phone}
            placeholder="Phone"
            onChange={handleChange}
            className="w-full"
          />
          <Input
            type="text"
            name="username"
            value={formData.username}
            placeholder="Username"
            onChange={handleChange}
            className="w-full"
          />
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update User"}
          </Button>
        </form>
        {/* <Button
          variant="ghost"
          className="w-full mt-4 text-red-500"
          onClick={onClose}
        >
          Cancel
        </Button> */}
      </div>
    </section>
  );
};

export default UpdateUserPopUp;
