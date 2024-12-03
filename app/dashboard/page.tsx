"use client";
import React from "react";
import { FaUsers, FaSignOutAlt, FaWallet, FaHeadset, FaProjectDiagram, FaHistory,FaClipboardList } from "react-icons/fa";
import Link from "next/link";
import { useAuthContext } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { authRouter } from "@/lib/ProtectedRouter";

const Dashboard = () => {
  const { userId, logout, userRole } = useAuthContext();
  const router = useRouter();

  // Logout Handler
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        sessionStorage.removeItem("authToken");
        sessionStorage.removeItem("userId");
        logout();
        router.push("/auth/login");
      } else {
        console.error("Failed to logout");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="relative container mx-auto p-4 mt-6 text-center">
      <h1 className=" text-3xl sm:text-[4rem] max-w-[40rem] p-12 abosolute inset-x-0 mx-auto font-[600]  text-transparent bg-clip-text bg-gradient-to-br from-indigo-300 to-purple-400">Menu</h1>
      <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 justify-items-center sm:gap-4 gap-2">


        {/*------------ Users ------------*/}
        <motion.div
          whileHover={{ scale: 1.04 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="p-5  sm:dark:border sm:dark:border-neutal-800 rounded-md sm:shadow-xl w-4/5 sm:w-[20rem] sm:h-64 h-40  flex flex-col items-center gap-1 bg-primary-foreground/25"
        >
          <FaUsers className="size-14" />
          <Link href="/users" className="flex items-center gap-2 text-lg hover:text-gray-400 transition">
            Users
          </Link>
        </motion.div>

        {/*------------ Products ------------*/}
        <motion.div
          whileHover={{ scale: 1.04 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="p-5 sm:dark:border sm:dark:border-neutal-800 rounded-md sm:shadow-xl w-4/5 sm:w-[20rem]  sm:h-64 h-40 flex flex-col items-center gap-2 bg-primary-foreground/25"
        >
          <FaProjectDiagram className="size-14" />
          {userId ? (<Link href="/productlist" className="flex items-center gap-2 text-lg hover:text-gray-400 transition">
            Products
          </Link>) : (
            <Link href="/auth/login" className="flex items-center gap-2 text-lg hover:text-gray-400 transition">
              Products
            </Link>
          )}
        </motion.div>

        {/*------------ Orders ------------*/}
        <motion.div
          whileHover={{ scale: 1.04 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="p-5 sm:dark:border sm:dark:border-neutal-800 rounded-md sm:shadow-xl w-4/5 sm:w-[20rem]  sm:h-64 h-40 flex flex-col items-center gap-2 bg-primary-foreground/25"
        >
          <FaHistory className="size-14" />
          {userId ? (<Link href="/rentalhistory" className="flex items-center gap-2 text-lg hover:text-gray-400 transition">
            Orders
          </Link>) : (
            <Link href="/auth/login" className="flex items-center gap-2 text-lg hover:text-gray-400 transition">
              Orders
            </Link>
          )}
        </motion.div>


        {/*------------ Wallet ------------*/}
        <motion.div
          whileHover={{ scale: 1.04 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="p-5 sm:dark:border sm:dark:border-neutal-800 rounded-md sm:shadow-xl w-4/5 sm:w-[20rem]  sm:h-64 h-40 flex flex-col items-center gap-2 bg-primary-foreground/25"
        >
          <FaWallet className="size-14" />
          {userId ? (<Link href="/wallet" className="flex items-center gap-2 text-lg hover:text-gray-400 transition">
              Wallet
            </Link>) : (
            <Link href="/auth/login" className="flex items-center gap-2 text-lg hover:text-gray-400 transition">
              Wallet
            </Link>
          )}
        </motion.div>

        {/*------------ Support ------------*/}

        <motion.div
          whileHover={{ scale: 1.04 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="p-5 sm:dark:border sm:dark:border-neutal-800 rounded-md sm:shadow-xl w-4/5 sm:w-[20rem]  sm:h-64 h-40 flex flex-col items-center gap-2 bg-primary-foreground/25"
        >
          <FaHeadset className="size-14" />
          {userId ? (<Link href="/support" className="flex items-center gap-2 text-lg hover:text-gray-400 transition">
              Support
            </Link>) : (
            <Link href="/auth/login" className="flex items-center gap-2 text-lg hover:text-gray-400 transition">
              Support
            </Link>
          )}
        </motion.div>



        {/*------------ Users Notifications ------------*/}

        {userRole === "admin" &&(<motion.div
          whileHover={{ scale: 1.04 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="p-5 sm:dark:border sm:dark:border-neutal-800 rounded-md sm:shadow-xl w-4/5 sm:w-[20rem]  sm:h-64 h-40 flex flex-col items-center gap-2 bg-primary-foreground/25"
        >
         <FaClipboardList className="size-14" />
          
            <Link href="/admin/userNotifications" className="flex items-center gap-2 text-lg hover:text-gray-400 transition">
              Users Request
            </Link>
          
        </motion.div>)}



        {/*------------ Logout ------------*/}
        {userId && (<motion.div
          whileHover={{ scale: 1.04 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="p-5 sm:dark:border sm:dark:border-neutal-800 rounded-md sm:shadow-xl w-4/5 sm:w-[20rem]  sm:h-64 h-40  flex flex-col items-center gap-2 bg-primary-foreground/25"
        >
          <FaSignOutAlt className="size-14" />
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-lg text-red-500  hover:text-red-700"
          >
            Logout
          </button>

        </motion.div>)}

      </div>

      <div className="fixed top-0 -z-10 h-full w-full">
        <div className="fixed bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full dark:bg-[rgba(172,100,255,0.6)] bg-[rgba(134,90,255,0.77)] opacity-50 blur-[80px]"></div>
      </div>

    </div>
  );
}

export default authRouter(Dashboard, ['admin']);
