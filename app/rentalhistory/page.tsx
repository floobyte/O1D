"use client";
import React, { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";

interface RentalProduct {
  _id: string;
  productName: string;
  rentAmount: number;
  rentalPeriod: number;
  dailyEarning: number;
  rentDate: string;
  lastEarningUpdate: string;
  color: string;
  deliveryStatus: string;
}

const RentalHistory = () => {
  const [rentalProducts, setRentalProducts] = useState<RentalProduct[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { userId } = useAuthContext();

  useEffect(() => {
    const fetchRentalHistory = async () => {
      try {
        if (!userId) return;

        const response = await fetch(`/api/rentalproduct/${userId}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        const sortedProducts = data.rentalProducts.sort(
          (a: RentalProduct, b: RentalProduct) =>
            new Date(b.rentDate).getTime() - new Date(a.rentDate).getTime()
        );

        setRentalProducts(sortedProducts);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching rental history.");
      }
    };

    fetchRentalHistory();
  }, [userId]);

  if (!userId) {
    return <p className="text-center">Please log in to view your rental history.</p>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4 m-8 text-gray-600 md:m-12">
      <h2 className="text-xl md:text-2xl font-semibold mb-4 text-center text-white">
        Rental History
      </h2>
      {rentalProducts.length > 0 ? (
        <div className="flex flex-col gap-4">
          {rentalProducts.map((product) => (
            <div
              key={product._id}
              className="border rounded-lg shadow p-4 flex flex-col md:flex-row gap-4 items-center md:items-start bg-slate-950 text-center sm:text-left"
            >
              {/* Product Image */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                <img
                  // src={`/images/${product._id}.jpg`} // Replace with actual image URL
                  alt={product.productName}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="flex-grow text-white">
                <h3 className="text-base md:text-lg font-medium">{product.productName}</h3>
                <p className="text-sm md:text-base">
                  <strong>Rent Amount:</strong> ₹{product.rentAmount}
                </p>
                <p className="text-sm md:text-base">
                  <strong>Rental Period:</strong> {product.rentalPeriod} days
                </p>
                <p className="text-sm md:text-base">
                  <strong>Rent Date:</strong> {new Date(product.rentDate).toLocaleDateString()}
                </p>
              </div>

              {/* Status and Actions */}
              <div className="text-sm md:text-base text-green-400 font-semibold text-center sm:text-left">
                <p>
                  {product.deliveryStatus || "Rented"} on{" "}
                  {new Date(product.lastEarningUpdate).toLocaleDateString()}
                </p>
                <p className="text-xs md:text-sm text-white">Your item has been rented</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-white">No rental history found for this user.</p>
      )}
    </div>
  );
};

export default RentalHistory;
