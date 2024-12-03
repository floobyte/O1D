'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const SupportDropdown: React.FC = () => {
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
        Support
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute mt-2 w-48 bg-white border rounded shadow-lg">
          <ul>
            <li>
              <Link href="/support/raiseticket">
                <p className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Raiseticket</p>
              </Link>
            </li>
            <li>
              <Link href="/support/viewticket">
                <p className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Viewticket</p>
              </Link>
            </li>

            <li>
              <Link href="/support/message">
                <p className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Reply</p>
              </Link>
            </li>
            
          </ul>
        </div>
      )}
    </div>
  );
};

export default SupportDropdown;
