import React from "react";

type UniversalWalletData = {
  name: string;
  value: number;
};

type UniversalWalletProps = {
  wallet: UniversalWalletData[];
};

const UniversalWallet: React.FC<UniversalWalletProps> = ({ wallet }) => {
  return (
    <div className="p-4 bg-white shadow-lg rounded-lg">
      <ul className="space-y-4">
        {wallet.map((item, index) => (
          <li
            key={index}
            className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-lg"
          >
            <span className="text-lg font-medium text-gray-800">{item.name}</span>
            <span className="text-lg font-bold text-indigo-600">{item.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UniversalWallet;
