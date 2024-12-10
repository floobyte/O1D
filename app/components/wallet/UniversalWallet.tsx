import React from "react";
import { motion } from "framer-motion";

type UniversalWalletData = {
  name: string;
  value: number;
};

type UniversalWalletProps = {
  universalWallet: UniversalWalletData[];
};

const UniversalWallet: React.FC<UniversalWalletProps> = ({ universalWallet }) => {
  return (

    <motion.div
      whileHover={{ scale: 1.04 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="dark:bg-slate-950 mt-6 p-5 sm:dark:border sm:dark:border-neutral-400 rounded-md sm:shadow-xl w-full sm:w-[30rem] mx-auto flex flex-col items-center gap-4 bg-primary-foreground/25"
    >
      <div className="p-4 bg-white shadow-lg rounded-lg">
        <ul className="space-y-4">
          {universalWallet.map((item, index) => (
            <li
              key={index}
              className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-lg"
            >
              <span className="text-lg font-medium text-gray-800">{item.name}</span>
              <span className="text-lg font-bold text-indigo-600">₹{item.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default UniversalWallet;
