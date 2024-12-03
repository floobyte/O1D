import React, { useEffect, useState } from "react";

interface ActiveRental {
  rentalId: string;
  productName: string;
  rentAmount: number;
  dailyEarning: number;
  rentalPeriod: number;
  remainingDays: number;
}

export default function ActiveRentals() {
  const [rentals, setRentals] = useState<ActiveRental[]>([]);

  useEffect(() => {
    const fetchRentals = async () => {
      const res = await fetch("/api/activeRentals"); // Adjust endpoint
      const data = await res.json();
      setRentals(data.rentals);
    };

    fetchRentals();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Active Rentals</h2>
      <ul className="space-y-4">
        {rentals.map((rental) => (
          <li key={rental.rentalId} className="p-4 border rounded-lg">
            <h3 className="text-lg font-semibold">{rental.productName}</h3>
            <p>Rent Amount: ${rental.rentAmount}</p>
            <p>Daily Earning: ${rental.dailyEarning}</p>
            <p>Remaining Days: {rental.remainingDays}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
