// components/PopUpModal.tsx
import React from "react";

interface PopUpModalProps {
  message: string;
  onClose: () => void;
}

const PopUpModal: React.FC<PopUpModalProps> = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-slate-800 text-center rounded-lg p-6 w-4/5 sm:w-full max-w-md text-white shadow-lg relative">
        <button
          className="absolute top-2 right-2 bg-red-500 text-white hover:text-gray-400 rounded-sm"
          onClick={onClose}
        >
          ✕
        </button>
        <p className="text-xl text-green-400">{message}</p>
        <div className="mt-4">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopUpModal;
