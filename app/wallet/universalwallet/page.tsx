"use client";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/app/context/AuthContext";
import UniversalWallet from "@/app/components/wallet/UniversalWallet";

type UniversalWalletData = {
  name: string;
  value: number;
};

export default function WalletPage() {
  const [wallet, setWallet] = useState<UniversalWalletData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { walletId } = useAuthContext();

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const response = await fetch(`/api/wallets/universalwallet`);
        if (!response.ok) {
          throw new Error("Failed to fetch wallet data");
        }
        const data = await response.json();
        setWallet(data.universalWallet); // Set the universal wallet data
      } catch (err) {
        console.error("An error occurred while fetching wallet data.", err);
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
    <div className="relative container mx-auto p-4 mt-6 text-center">
      <h1 className="text-3xl sm:text-[4rem] max-w-[40rem] p-12 abosolute inset-x-0 mx-auto font-[600] text-transparent bg-clip-text bg-gradient-to-br from-indigo-200 to-purple-700">
        Universal Wallet
      </h1>
      <div className="w-full sm:w-[90%] lg:w-[70%] absolute inset-x-0 m-auto">
        {wallet && wallet.length > 0 ? (
          <UniversalWallet wallet={wallet} />
        ) : (
          <p className="text-lg text-gray-500">Wallet not found.</p>
        )}
      </div>
    </div>
  );
}
