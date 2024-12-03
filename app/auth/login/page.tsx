"use client"; // This makes the component a client component

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/app/context/AuthContext";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { User } from "@/types";
import { fetchUsers } from "@/app/services/api";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { login } = useAuthContext(); // Access login function from AuthContext
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchUsers();
      setUsers(data);
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Ensures cookies are sent with requests
        body: JSON.stringify({ email, password }),
      });
 
      if (response.ok) {
        const data = await response.json();
        login(data.user.id, data.user.token, data.user.walletId, data.user.role,data.user.userName); // Set userId and authToken in context and sessionStorage
        
        setIsModalVisible(true);

        setTimeout(() => {
          router.push("/dashboard");
        }, 800);
        
        toast({
          title: "Login successful",
          description: "You have logged in successfully.",
        });
      } else {
        setError("Blocked By Admin or Invalid email or password");
      }
    } catch (err) {
      setError("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    router.push('/dashboard');
  }

  return (
    <section className="w-full h-screen flex justify-center items-center">
      <div className="space-y-4 sm:border sm:rounded-xl sm:p-8 sm:shadow-xl bg-slate-100 dark:bg-slate-950 max-w-lg mx-auto">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold">Login</h1>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        <form className="space-y-4 w-80" onSubmit={(e) => e.preventDefault()}>
          <Input
            type="email"
            name="email"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="bg-slate-100 dark:bg-slate-950"
            required
          />
          <Input
            type="password"
            name="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="bg-slate-100 dark:bg-slate-950"
            required
          />
          <Button
            className="w-full bg-gradient-to-br hover:shadow-md hover:bg-gradient-to-tl hover:from-indigo-500 hover:to-purple-700 ring-2 dark:ring-indigo-800 ring-indigo-300 from-indigo-500 to-purple-700 text-white "
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/auth/signUp" className="text-blue-600 hover:text-blue-800">
             Sign Up
            </Link>
          </p>
        </div>
      </div>

      {isModalVisible && (
        <div
        id="static-modal"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 w-[28rem] max-w-md md:max-w-lg lg:max-w-xl mx-4">
          <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Login Successful
            </h3>
            <button
              onClick={handleModalClose}
              className="text-gray-400 bg-transparent hover:bg-gray-200 rounded-lg text-sm p-1.5 dark:hover:bg-red-600"
            >
              <span className="sr-only">Close</span>
              &#10005;
            </button>
          </div>
          <div className="p-6 text-center">
            <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Welcome back! You have logged in successfully.
            </p>
          </div>
          <div className="flex justify-end p-4 border-t dark:border-gray-600">
            <Button
              onClick={handleModalClose}
              className="bg-blue-700 hover:bg-blue-800 text-white"
            >
              Proceed
            </Button>
          </div>
        </div>
      </div>
      
      
      )}
    </section>
  );
};

export default LoginPage;
