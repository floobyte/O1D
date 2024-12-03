"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";


interface Product {
  _id: string;
  productName: string;
  rentAmount: number;
  dailyEarning: number;
  rentDays: number;
  isRented: boolean;
}

export default function RentalProduct() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  const router = useRouter();
  console.log({productId});
  useEffect(() => {
    async function fetchProduct() {
      if (!productId) return;
      try {
        const res = await fetch(`/api/rentalproduct/${productId}`, {
          method: "GET",
        });
        if (res.ok) {
          const data = await res.json();
          setProduct(data.product);
        } else {
          console.error("Failed to fetch product");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    }
    fetchProduct();
  }, [productId]);

  const handleRent = async () => {
    if (!productId) return;
    const userId = "67342617f412f33537e6a54e"; // Replace with actual user ID
    setLoading(true);
    try {
      const res = await fetch("/api/rentalproduct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId }),
      });

      if (res.ok) {
        console.log("Hare");
        alert("Product rented successfully!");
        router.push('/dashboard');
        setProduct({ ...product!, isRented: true });
      } else {
        const errorData = await res.json();
        alert(`Failed to rent product: ${errorData.error}`);
      }

   

    } catch (error) {
      console.error("Error renting product:", error);
      alert("Failed to rent product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      {product ? (
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-bold mb-4">{product.productName}</h2>
          <p>Rent Amount: ₹{product.rentAmount}</p>
          <p>Daily Earning: ₹{product.dailyEarning}</p>
          <p>Rental Days: {product.rentDays}</p>
          {product.isRented ? (
            <span className="text-green-500 font-semibold">Rented</span>
          ) : (
            <button
              onClick={handleRent}
              className={`mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Processing..." : "Rent"}
            </button>
          )}
        </div>
      ) : (
        <p>Loading product details...</p>
      )}
    </div>
  );
}
