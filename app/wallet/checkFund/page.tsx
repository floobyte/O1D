"use client";

import { useEffect, useState } from "react";
import { useAuthContext } from "@/app/context/AuthContext";
import CheckFund from "@/app/components/wallet/CheckFund";

type Wallet = {
  addFund: number;
  withdrawFund: number;
  checkFund: number;
  pendingWithdrawal: number;
};

export default function WalletPage() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { walletId } = useAuthContext();

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const response = await fetch(`/api/wallets/checkFund/${walletId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch wallet data");
        }
        const data = await response.json();
        setWallet(data.wallet);
      } catch (err) {
        console.log("An error occurred while fetching wallet data.",err);
        setError("An error occurred while fetching wallet data.");
      } finally {
        setLoading(false);
      }
    };

    fetchWallet();
  }, [walletId]);

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4 sm:p-8 mx-auto max-w-screen-xl text-center">
      <h1 className="text-3xl sm:text-[4rem] font-[600] text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-purple-700 mb-6">
        Wallet Information
      </h1>
      <div className="w-full sm:w-[90%] lg:w-[70%] mx-auto">
        {wallet ? (
          <CheckFund wallet={wallet} />
        ) : (
          <p className="text-lg text-gray-500">Wallet not found.</p>
        )}
      </div>
    </div>
  );
}
