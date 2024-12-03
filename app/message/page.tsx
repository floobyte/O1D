"use client";

import React, { useEffect, useState } from "react";
import { socket, connectSocket, disconnectSocket } from "@/utils/socket";
import { useUser } from "../context/AuthContext";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<string[]>([]);
  const [recipient, setRecipient] = useState(""); // Recipient's username or ID
//   const loggedInUser = "user1"; // Replace with dynamic user ID after login
  const { userId } = useUser();

  useEffect(() => {
    connectSocket();

    // Register the logged-in user with the server
    socket.emit("register", userId);

    // Listen for messages from the server
    socket.on("privateMessage", (data) => {
      console.log("Message received:", data);
      setChatHistory((prev) => [
        ...prev,
        `${data.sender}: ${data.message}`,
      ]);
    });

    // Cleanup on unmount
    return () => {
      socket.off("privateMessage");
      disconnectSocket();
    };
  }, [userId]);

  const sendMessage = () => {
    if (message.trim() && recipient.trim()) {
      socket.emit("privateMessage", {
        sender: userId,
        recipient,
        message,
      });
      setChatHistory((prev) => [
        ...prev,
        `You to ${recipient}: ${message}`,
      ]);
      setMessage(""); // Clear the input field
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-4 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Chat Room
        </h1>
        <div className="mb-4">
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Recipient's username or ID"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="h-64 overflow-y-auto p-4 mb-4 bg-gray-50 border border-gray-200 rounded-md">
          {chatHistory.length > 0 ? (
            chatHistory.map((msg, index) => (
              <p key={index} className="text-gray-700 mb-2">
                {msg}
              </p>
            ))
          ) : (
            <p className="text-gray-400 text-center">No messages yet.</p>
          )}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
          />
          <button
            onClick={sendMessage}
            className="px-6 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;











// "use client";

// import React, { useEffect, useState } from "react";
// import { socket, connectSocket, disconnectSocket } from "@/utils/socket";
// import { useUser } from "../context/UserContext";

// const Chat = () => {
//     const [message, setMessage] = useState(""); // State to hold the custom message
//     const [chatHistory, setChatHistory] = useState<string[]>([]); // State to hold chat messages
//     const [recipient, setRecipient] = useState("");
//     const { userId } = useUser();

//     useEffect(() => {
//         connectSocket();

//         // Listen to messages from the server
//         socket.on("message", (data) => {
//             console.log("Message from server:", data);
//             setChatHistory((prev) => [...prev, `Server: ${data}`]);
//         });

//         // Cleanup on unmount
//         return () => {
//             socket.off("message");
//             disconnectSocket();
//         };
//     }, []);

//     const sendMessage = () => {
//         if (message.trim() !== "") {
//             socket.emit("clientMessage", message); // Send the custom message to the server
//             setChatHistory((prev) => [...prev, `You: ${message}`]); // Add the message to the chat history
//             setMessage(""); // Clear the input field
//         }
//     };

//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//             <div className="w-full max-w-lg p-4 bg-white shadow-md rounded-lg">
//                 <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
//                     Chat Room
//                 </h1>
//                 <div className="h-64 overflow-y-auto p-4 mb-4 bg-gray-50 border border-gray-200 rounded-md">
//                     {chatHistory.length > 0 ? (
//                         chatHistory.map((msg, index) => (
//                             <p key={index} className="text-gray-700 mb-2">
//                                 {msg}
//                             </p>
//                         ))
//                     ) : (
//                         <p className="text-gray-400 text-center">No messages yet.</p>
//                     )}
//                 </div>
//                 <div className="flex gap-2">
//                     <input
//                         type="text"
//                         value={message}
//                         onChange={(e) => setMessage(e.target.value)}
//                         placeholder="Type your message..."
//                         className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
//                     />
//                     <button
//                         onClick={sendMessage}
//                         className="px-6 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     >
//                         Send
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Chat;
