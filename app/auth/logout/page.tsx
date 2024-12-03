// "use client";
// import { useRouter } from "next/navigation";

// const logout = () => {

//     const router = useRouter();

//     const handleLogout = async () => {
//         try {

//             const response = await fetch('/api/auth/logout', {
//                 method: "POST",
//                 credentials: "include"  // Ensures cookies are sent with the request
//             })

//             if (response.ok) {
//                 router.push('/users/login');
//             } else {
//                 console.error('Failed to logout');
//             }

//         } catch (error) {
//             console.error('Error during the Logout!', error);
//         }
//     }

//     return (
//         <div>
//             <button
//                 onClick={() => handleLogout()}
//                 className="px-4 py-2 font-semibold text-white bg-red-600 rounded-md hover:bg-red-700"
//             >
//                 Logout
//             </button>

//         </div>
//     )
// }

// export default logout;