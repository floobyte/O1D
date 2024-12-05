"use client";
import React, { useEffect, useState } from "react";
import { useAuthContext } from "@/app/context/AuthContext";
import { useRouter } from 'next/navigation';

interface Ticket {
    _id: string;
    subjectLine: string;
    priority: string;
    category: string;
    ticketId: string;
    createdAt: string;
}

const ViewTicket = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [error, setError] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const { userId, userRole } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        const fetchTickets = async () => {
            setError("");
            try {
                const apiEndPoint =
                    userRole === "admin" ? "/api/support/ticket" : `/api/support/ticket/${userId}`;

                const response = await fetch(apiEndPoint, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch tickets.");
                }

                const data = await response.json();
                setTickets(data.tickets);
            } catch (err) {
                console.log("An error occurred while fetching tickets.", err);
                setError("An error occurred while fetching tickets.");
            }
        };

        fetchTickets();
    }, [userId, userRole]);

    const handleCloseTicket = async (ticketId: string) => {
        setMessage("");
        setError("");

        try {
            const response = await fetch("/api/support/ticket/closeTicket", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ticketId }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(`Ticket ${ticketId} closed successfully.`);
                setTickets((prevTickets) =>
                    prevTickets.filter((ticket) => ticket.ticketId !== ticketId)
                );
                router.push('/support');
            } else {
                setError(data.error || `Failed to close ticket ${ticketId}.`);
            }
        } catch (err) {
            setError(`An error occurred while closing ticket ${ticketId}.`);
            console.error("Error:", err);
        }
    };

    const handelReply = () => {
        router.push('/support/reply');
    }

    return (
        <div className="p-6 max-w-5xl mx-auto bg-white rounded-lg shadow-lg mt-16 mb-12">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Support Tickets</h2>
            {error && (
                <div className="text-red-600 mb-4 p-2 bg-red-100 rounded-md text-sm">
                    {error}
                </div>
            )}
            {message && (
                <div className="text-green-600 mb-4 p-2 bg-green-100 rounded-md text-sm">
                    {message}
                </div>
            )}
            {tickets.length > 0 ? (
                <div className="space-y-4">
                    {tickets.map((ticket) => (
                        <div
                            key={ticket._id}
                            className="border border-gray-300 rounded-lg p-4 bg-slate-950 shadow-sm hover:shadow-lg transition duration-300"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-white">{ticket.subjectLine}</h3>
                                <span
                                    className={`text-xs px-2 py-1 rounded-full ${ticket.priority === "High"
                                        ? "bg-red-500 text-white"
                                        : ticket.priority === "Medium"
                                            ? "bg-yellow-500 text-white"
                                            : "bg-green-500 text-white"
                                        }`}
                                >
                                    {ticket.priority}
                                </span>
                            </div>
                            <div className="text-sm text-white">
                                <p>
                                    <strong>Category:</strong> {ticket.category}
                                </p>
                                <p>
                                    <strong>Ticket ID:</strong> {ticket.ticketId}
                                </p>
                                <p>
                                    <strong>Created At:</strong> {new Date(ticket.createdAt).toLocaleString()}
                                </p>
                            </div>
                            <div className="flex  gap-2 flex-row-reverse justify-end">
                                <div className="mt-4 ">
                                    <button
                                        onClick={() => handleCloseTicket(ticket.ticketId)}
                                        className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-md hover:bg-red-700 transition duration-300"
                                    >
                                        Close
                                    </button>
                                </div>

                                {/*<------------------------ Reply to Ticket ---------------------------------->*/}

                                <div className="mt-4 ">
                                    <button
                                        onClick={() => handelReply()}
                                        className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition duration-300"
                                    >
                                        Reply
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-600 text-sm">No tickets found.</p>
            )}
        </div>
    );
};

export default ViewTicket;
