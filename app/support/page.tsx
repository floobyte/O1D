"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FaEye, FaTicketAlt } from 'react-icons/fa';
import Link from 'next/link';
import { useAuthContext } from '../context/AuthContext';

export default function SupportPage() {

    const { userId } = useAuthContext();

    return (
        <div className="relative container mx-auto p-4 mt-6 text-center">
            <h1 className=" text-3xl sm:text-[4rem] max-w-[40rem] p-12 abosolute inset-x-0 mx-auto font-[600]  text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-purple-700">Support</h1>
            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 justify-items-center sm:gap-4 gap-2">

                {/*<--------------------------------- Raise Ticket ---------------------------->*/}
                <motion.div
                    whileHover={{ scale: 1.04 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="p-5  sm:dark:border sm:dark:border-neutal-800 rounded-md sm:shadow-xl w-4/5 sm:w-[20rem] sm:h-64 h-40  flex flex-col items-center gap-1 bg-primary-foreground/25"
                >
                    <FaTicketAlt className="size-14" />
                    <Link href="/support/raiseticket" className="flex items-center gap-2 text-lg hover:text-gray-400 transition">
                        RaiseTicket
                    </Link>
                </motion.div>


                {/*<--------------------------------- View Ticket ---------------------------->*/}

               {userId && (<motion.div
                    whileHover={{ scale: 1.04 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="p-5  sm:dark:border sm:dark:border-neutal-800 rounded-md sm:shadow-xl w-4/5 sm:w-[20rem] sm:h-64 h-40  flex flex-col items-center gap-1 bg-primary-foreground/25"
                >
                    <FaEye className="size-14" />
                    <Link href="/support/viewticket" className="flex items-center gap-2 text-lg hover:text-gray-400 transition">
                        ViewTicket
                    </Link>
                </motion.div>)}

            </div>
        </div>
    )
}

