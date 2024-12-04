import React, { useState } from "react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

interface RentalFormProps {
  onClose: () => void;
  onProductAdded: () => void;
}

interface FormData {
  productName: string;
  rentAmount: string;
  rentDays: string;
  dailyEarning: string;
  offerTiming: string;
  totalEarning: string;
  buyAmount: string;
}

export default function RentalForm({ onClose, onProductAdded }: RentalFormProps) {
  const [formData, setFormData] = useState<FormData>({
    productName: "",
    rentAmount: '',
    rentDays: '',
    dailyEarning: '',
    offerTiming: "",
    totalEarning: '',
    buyAmount: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/productlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to create rental");

      toast({
        title: "Product added successfully",
        description: new Date().toString(),
      });

      onProductAdded();
      setIsModalVisible(true);
    } catch (err) {
      console.log("Error creating rental. Please try again.",err);
      setError("Error creating rental. Please try again.");
    }
  };

  // const handleFormToggle = () => setIsModalVisible(!isModalVisible);

  const handleModalClose = () => {
    setIsModalVisible(false);
    onClose();
  };

  return (
    <section className="w-4/5 sm:w-full mt-20 sm:mb-2 mb-20 flex justify-center items-center ml-16">
      <div className="space-y-4 sm:border sm:rounded-xl sm:p-6 sm:shadow-xl bg-slate-100 dark:bg-slate-950 max-w-lg sm:mx-auto mr-12">

        <form className="space-y-4 w-72 relative" onSubmit={handleSubmit}>

          <div className="flex justify-between">

            <div className="space-y-1 text-center">
              <h1 className="text-2xl font-bold">Add New Product</h1>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>

            {/* Close Button in Top Right Corner */}
            <button
              className="absolute top-0 right-0 bg-red-500 text-white hover:text-gray-400 rounded-sm px-2"
              onClick={() => onClose()}
            >
              ✕
            </button>

          </div>

          {["productName", "offerTiming"].map((field) => (
            <Input
              key={field}
              type="text"
              name={field}
              value={formData [field as keyof FormData]}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              onChange={handleChange}
              className="bg-slate-100 dark:bg-slate-950"
              required
            />
          ))}
          {["rentAmount", "rentDays", "dailyEarning", "totalEarning", "buyAmount"].map((field) => (
            <Input
              key={field}
              type="number"
              name={field}
              value={formData[field as keyof FormData]}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              onChange={handleChange}
              className="bg-slate-100 dark:bg-slate-950 appearance-none [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
              required
            />
          ))}

          <Button
            className="w-full bg-gradient-to-br hover:shadow-md hover:bg-gradient-to-tl hover:from-indigo-500 hover:to-purple-700 ring-2 dark:ring-indigo-800 ring-indigo-300 from-indigo-500 to-purple-700 text-white"
            type="submit"
          >
            Add Product
          </Button>

        </form>

      </div>

      {isModalVisible && (
        <div id="static-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 max-w-lg w-full">
            <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Product Added</h3>
              <button onClick={handleModalClose} className="text-gray-400 bg-transparent hover:bg-gray-200 rounded-lg text-sm p-1.5 dark:hover:bg-red-600">
                <span className="sr-only">Close</span>
                &#10005;
              </button>
            </div>
            <div className="p-4 text-gray-600 dark:text-gray-300">
              <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-lg text-gray-600 dark:text-gray-300">
                The product has been added successfully!
              </p>
            </div>
            <div className="flex justify-end p-4 border-t dark:border-gray-600">
              <Button onClick={handleModalClose} className="bg-blue-700 hover:bg-blue-800 text-white">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
