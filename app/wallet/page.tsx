"use client";
import React, { useState, useEffect } from "react";
import {
  FaMoneyCheckAlt,
  FaCheck,
  FaArrowAltCircleDown,
  FaHistory,
  FaSearchDollar,
  FaCheckCircle,
} from "react-icons/fa";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuthContext } from "../context/AuthContext";
import AddFundForm from "../components/wallet/AddFundForm";
import ApproveFundForm from "../components/wallet/ApproveFundForm";
import RequestWithdrawalForm from "../components/wallet/RequestWithdrawalForm";
import ApproveWithdrawalForm from "../components/wallet/ApproveWithdrawalForm";
import CheckFund from "../components/wallet/CheckFund";
import UniversalWallet from "../components/wallet/UniversalWallet";

type ModalType =
  | "addFund"
  | "approveFund"
  | "requestWithdrawal"
  | "approveWithdrawal"
  | "checkFund"
  | "UniversalWallet"
  | null;

type Wallet = {
  addFund: number;
  withdrawFund: number;
  checkFund: number;
  pendingWithdrawal: number;
};

export default function WalletPage() {
  const [isModalOpen, setIsModalOpen] = useState<ModalType>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { walletId, userRole } = useAuthContext();

  const walletOptions = [
    { label: "Add Fund", icon: <FaMoneyCheckAlt size={40} />, modal: "addFund", roles: ["user", "admin"] },
    { label: "Approve Fund", icon: <FaCheck size={40} />, modal: "approveFund", roles: ["admin"] },
    { label: "Request Withdrawal", icon: <FaArrowAltCircleDown size={40} />, modal: "requestWithdrawal", roles: ["user", "admin"] },
    { label: "Approve Withdrawal", icon: <FaSearchDollar size={40} />, modal: "approveWithdrawal", roles: ["admin"] },
    { label: "Check Balance", icon: <FaCheckCircle size={40} />, modal: "checkFund", roles: ["user", "admin"] },
    { label: "Wallet History", icon: <FaHistory size={40} />, href: "/wallet/wallethistory", roles: ["user", "admin"] },
    { label: "Total Ammount", icon: <FaHistory size={40} />, href: "/wallet/universalwallet", roles: ["admin"] },
  ];

  const role = userRole ?? "guest";
  const filteredOptions = walletOptions.filter((option) => option.roles.includes(role));

  const openModal = (modalType: ModalType) => setIsModalOpen(modalType);
  const closeModal = () => setIsModalOpen(null);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const response = await fetch(`/api/wallets/checkFund/${walletId}`);
        // if (!response.ok) {
        //   throw new Error("Failed to fetch wallet data");
        // }
        const data = await response.json();
        setWallet(data.wallet);
      } catch (error) {
        setError( "An error occurred while fetching wallet data.");
      } finally {
        setLoading(false);
      }
    };

    fetchWallet();
  }, [walletId]);

  return (
    <div className="relative container mx-auto p-4 mt-6 text-center">
      <h1 className="text-3xl sm:text-[4rem] max-w-[40rem] p-12 abosolute inset-x-0 mx-auto font-[600] text-transparent bg-clip-text bg-gradient-to-br from-indigo-200 to-purple-700">
        Wallet
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 justify-items-center sm:gap-4 gap-2">
        {filteredOptions.map((option, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.04 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="p-5 sm:dark:border sm:dark:border-neutal-800 rounded-md shadow-xl w-4/5 sm:w-[20rem] sm:h-64 h-40 flex flex-col items-center gap-2 bg-primary-foreground/25 text-indigo-200"
          >
            {option.icon}
            {option.href ? (
              <Link href={option.href} className="flex items-center gap-2 text-lg hover:text-gray-400 transition">
                {option.label}
              </Link>
            ) : (
              <button
                onClick={() => openModal(option.modal as ModalType)}
                className="flex items-center gap-2 text-lg hover:text-gray-400 transition"
              >
                {option.label}
              </button>
            )}
          </motion.div>
        ))}
      </div>


      {/*<------------------------------------ AddFundForm ------------------------------>*/}

      {/* Modal Rendering */}
      {isModalOpen === "addFund" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md sm:w-[400px] relative">
            <button
              className="absolute top-2 right-2 text-xl bg-red-500 hover:text-white text-gray-500 rounded-full p-1"
              onClick={closeModal}
            >
              ×
            </button>
            <AddFundForm />
          </div>
        </div>
      )}


      {/*<------------------------------------ ApproveFund Form ------------------------------>*/}

      {isModalOpen === "approveFund" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md sm:w-[400px] relative">
            <button
              className="absolute top-2 right-2 text-xl bg-red-500 hover:text-white text-gray-500 rounded-full p-1"
              onClick={closeModal}
            >
              ×
            </button>
            <ApproveFundForm />
          </div>
        </div>
      )}


      {/*<------------------------------------ Request Withdrawal Form ------------------------------>*/}

      {isModalOpen === "requestWithdrawal" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md w-[400px] relative">
            <button
              className="absolute top-2 right-2 text-xl bg-red-500 hover:text-white text-gray-500 rounded-full p-1"
              onClick={closeModal}
            >
              ×
            </button>
            <RequestWithdrawalForm />
          </div>
        </div>
      )}


      {/*<------------------------------------ Approve Withdrawal Form ------------------------------>*/}

      {isModalOpen === "approveWithdrawal" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md w-[400px] relative">
            <button
              className="absolute top-2 right-2 text-xl bg-red-500 hover:text-white text-gray-500 rounded-full p-1"
              onClick={closeModal}
            >
              ×
            </button>
            <ApproveWithdrawalForm />
          </div>
        </div>
      )}


      {/*<------------------------------------ CheckFund ------------------------------>*/}

      {isModalOpen === "checkFund" && wallet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="p-4 sm:p-6 md:p-8 rounded-md w-[80%] sm:w-[50%] md:w-[39vw] lg:w-[39vw] relative">
            <button
              className="absolute top-10 sm:top-16 right-4 sm:right-0 text-xl bg-red-500 hover:bg-red-600 text-white rounded-full p-2 z-10"
              onClick={closeModal}
            >
              ×
            </button>
            <CheckFund wallet={wallet} />
          </div>
        </div>
      )}


      {/*<-----------------------------  UniversalWallet ------------------------------->*/}

      {isModalOpen === "UniversalWallet" && wallet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="p-4 sm:p-6 md:p-8 rounded-md w-[80%] sm:w-[50%] md:w-[39vw] lg:w-[39vw] relative">
            <button
              className="absolute top-10 sm:top-16 right-4 sm:right-0 text-xl bg-red-500 hover:bg-red-600 text-white rounded-full p-2 z-10"
              onClick={closeModal}
            >
              ×
            </button>
            <UniversalWallet wallet={wallet} />
          </div>
        </div>
      )}


      {/* Loader and Error Handling */}
      {loading && <div className="p-4">Loading...</div>}
      {error && <div className="p-4 text-red-500">Error: {error}</div>}

      <div className="fixed top-0 -z-10 h-full w-full">
        <div className="fixed bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[rgba(134,90,255,0.77)] opacity-50 blur-[80px]"></div>
      </div>
    </div>
  );
}
