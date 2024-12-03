'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const WalletDropdown: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="relative">
      {/* Wallet Button */}
      <button
        onClick={toggleDropdown}
      // className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Wallet
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute mt-2 w-48 bg-white border rounded shadow-lg">
          <ul>
            <li>
              <Link href="/wallet/addfund">
                <p className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Add Fund</p>
              </Link>
            </li>
            <li>
              <Link href="/wallet/approvefund">
                <p className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Approve Fund</p>
              </Link>
            </li>
            <li>
              <Link href="/wallet/requestWithdrawal">
                <p className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Request Withdrawl</p>
              </Link>
            </li>
            <li>
              <Link href="/wallet/approve-withdrawal">
                <p className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Approve Withdrawal</p>
              </Link>
            </li>

            <li>
              <Link href="/wallet/checkFund">
                <p className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Check Fund</p>
              </Link>
            </li>

            <li>
              <Link href="/wallet/wallethistory">
                <p className="block px-4 py-2 text-gray-700 hover:bg-gray-100">WalletHistory</p>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default WalletDropdown;
