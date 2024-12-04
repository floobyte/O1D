"use client";
import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
import ProductList from "../components/ProductList";
import { useAuthContext } from "@/app/context/AuthContext";
import PopUpModal from "../components/PopUpProduct/PopUpModal";

interface Rental {
    _id: string;
    productName: string;
    productImage: string;
    rentAmount: number;
    rentDays: number;
    dailyEarning: number;
    totalEarning: number;
    buyAmount: number;
    offerTiming?: string;
    couponCode?: string;
}

export default function RentalsPage() {
    const [rentals, setRentals] = useState<Rental[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Rental | null>(null);
    // const router = useRouter();
    const { userRole, userId } = useAuthContext();
    const userIdString = `${userId}`;
    const [showPopup, setShowPopup] = useState(false);
    const [messagePopUp, setMessagePopUp] = useState("");


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

    const handleRental = async (productId: string) => {
        try {
            if (!userIdString) {
                console.log("User ID not found!");
                return;
            }
            const response = await fetch("/api/rentalproduct", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ productId, userId: userIdString }),
            });
      
            if (response.ok) {
                setMessagePopUp("Product rented successfully!");
                setShowPopup(true);
                // alert("Product rented successfully!");
            } else {
                setMessagePopUp("Failed to rent product! ");
                setShowPopup(true);
                // alert("Failed to rent product!");
            }
        } catch (error) {
            console.error("Error processing rental:", error);
        }
    };

    const handelClosePopUp = () => setShowPopup(false); // Close PopUp

    return (
        <div className="bg-slate-950 min-h-screen text-white px-4 py-8 relative">
            <h1 className="text-3xl font-bold mb-6 text-center mt-8">Products</h1>

            {/*<------------------------ Add Product Form ------------------->*/}

            <div className="flex justify-between items-center mb-6 fixed bottom-0 right-2 z-10">
                {(userRole === "admin") && (<button
                    className="bg-white hover:bg-gray-300 text-black px-4 py-2 rounded-lg transition-all duration-300"
                    onClick={handleFormToggle}
                >
                    {showForm ? "-" : "+"}
                </button>)}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-4/5 sm:w-full text-center
            absolute inset-x-0 mx-auto">
                {rentals.map((rental) => (
                    <div
                        key={rental._id}
                        className="bg-slate-800 rounded-lg shadow-lg p-4 flex flex-col space-y-4 cursor-pointer hover:shadow-2xl transition duration-300"
                        onClick={() => setSelectedProduct(rental)}
                    >
                        {/* Image Section */}
                        {/* <div className="relative">
                            <img
                                src={rental.productImage}
                                alt={rental.productName}
                                className="w-full h-48 object-cover rounded-md"
                            />
                        </div> */}

                        {/* Product Information */}
                        <div className="text-center">
                            <h2 className="text-xl font-semibold mb-2">{rental.productName}</h2>
                            <p className="text-xl font-bold">
                                <span className="text-red-500">Rental Price: </span>₹{rental.rentAmount}
                            </p>
                            <p className="text-gray-300 text-sm">Rent Days: {rental.rentDays}</p>
                            <p className="text-yellow-300 text-sm">Daily Earning: ₹{rental.dailyEarning}</p>
                        </div>

                        {/* Rent Button */}
                        <button
                            className="bg-indigo-700 text-white px-4 py-2 rounded-md hover:bg-indigo-800"

                        >
                            Rent Now
                        </button>
                    </div>
                ))}

                {/*<------------------------ Show Product Form ------------------->*/}

                {/* {showForm && (
                    <div className="mb-6">
                        <ProductList onClose={handleFormToggle} onProductAdded={handleFormToggle} />
                    </div>
                )} */}

                {showForm && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">

                        <ProductList onClose={handleFormToggle} onProductAdded={handleFormToggle} />

                    </div>
                )}

            </div>



            {/*<------------------------- Product Details Modal --------------------------->*/}
            {selectedProduct && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ">
                    <div className="bg-slate-800 text-center rounded-lg p-6 w-4/5 sm:w-full max-w-md text-white shadow-lg relative">
                        <button
                            className="absolute top-2 right-2 bg-red-500 text-white hover:text-gray-400 rounded-sm"
                            onClick={() => setSelectedProduct(null)}
                        >
                            ✕
                        </button>
                        {/* Product Details */}
                        {/* <img
                            src={selectedProduct.productImage}
                            alt={selectedProduct.productName}
                            className="w-full h-48 object-cover rounded-md mb-4"
                        /> */}
                        <h2 className="text-lg font-semibold">{selectedProduct.productName}</h2>
                        <p className="text-gray-100">Offer Validity: {selectedProduct.offerTiming || "N/A"}</p>
                        <p className="text-gray-100">Rental Days: {selectedProduct.rentDays}</p>
                        <p className="text-gray-100">Daily Earning: ₹{selectedProduct.dailyEarning}</p>
                        <p className="text-gray-100">Total Earning: ₹{selectedProduct.totalEarning}</p>
                        <p className="text-gray-100">Purchase Price: ₹{selectedProduct.buyAmount}</p>
                        <p className="text-gray-100">Coupon Code: {selectedProduct.couponCode || "N/A"}</p>
                        {/* Action Buttons */}
                        <div className="mt-4 flex space-x-2 justify-center">
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                onClick={() => handleRental(selectedProduct._id)}
                            >
                                Rent Now
                            </button>
                            <button
                                className="bg-yellow-400 text-white px-4 py-2 rounded-md hover:bg-yellow-500"
                                onClick={() => alert("Added to Cart!")}
                            >
                                Add to Cart
                            </button>
                            <button
                                className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
                                onClick={() => alert("Proceed to Buy!")}
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showPopup && 

           <PopUpModal message={messagePopUp} onClose={handelClosePopUp} />
            }
        </div>
    );
}
