"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductList from "../components/ProductList";

interface Rental {
  _id: string; // Include product ID
  productName: string;
  rentAmount: number;
  rentDays: number;
  dailyEarning: number;
  offerTiming: string;
  totalEarning: number;
  buyAmount: number;
}

export default function RentalsPage() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchRentals() {
      try {
        const response = await fetch("/api/productlist");
        const data = await response.json();
        setRentals(data.products || []);
      } catch (error) {
        console.error("Error fetching rentals:", error);
      }
    }
    fetchRentals();
  }, []);

  const handleFormToggle = () => setShowForm(!showForm);

  const handleRental = (productId: string) => {
    router.push(`/rentalproduct?productId=${productId}`);
  
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={handleFormToggle}
      >
        {showForm ? "Close Form" : "Add New Rental"}
      </button>
      {showForm && <ProductList onClose={handleFormToggle} onProductAdded={handleFormToggle} />}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rentals.map((rental) => (
          <div key={rental._id} className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold">Product Name: {rental.productName}</h2>
            <p>Rent Amount: ${rental.rentAmount}</p>
            <p>Rent Days: {rental.rentDays}</p>
            <p>Daily Earning: ${rental.dailyEarning}</p>
            <p>Offer Timing: {rental.offerTiming}</p>
            <p>Total Earning: ${rental.totalEarning}</p>
            <p>Buy Amount: ${rental.buyAmount}</p>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
              onClick={() => handleRental(rental._id)}
            >
              Rental
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
