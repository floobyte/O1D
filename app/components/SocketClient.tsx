// // app/components/SocketClient.tsx

// 'use client'

// import { useEffect } from 'react';
// import { io, Socket } from 'socket.io-client';

// // Define the Socket type
// let socket: Socket;

// const SocketClient = () => {
//   useEffect(() => {
//     // Connect to the Socket.io server
//     socket = io('http://localhost:4000');  // You can pass your server URL as an argument, e.g., io('http://localhost:4000')
    
//     // Listen for a 'message' event (you can listen for any event you want)
//     socket.on('message', (data) => {
//       console.log('Message from server:', data);
//       // Handle the incoming data here, e.g., display a notification or update UI
//     });

//     // Cleanup: Disconnect the socket when the component is unmounted
//     return () => {
//       socket.off('message');
//       socket.disconnect();
//     };
//   }, []);

//   return <></>;  // This component doesn't need to render anything itself
// };

// export default SocketClient;
