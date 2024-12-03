"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuthContext } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { FaHome, FaSignInAlt, FaUserCircle, FaWallet, FaHeadset, FaProjectDiagram, FaHistory } from "react-icons/fa";
import Notifications from "./Notification";


interface UserDetails {
  name: string;
  email: string;
  [key: string]: any;
}

const Navbar = () => {
  const { userId } = useAuthContext();
  const router = useRouter();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuthContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch User Details
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/users/${userId}`, {
          method: "GET",
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUserDetails(data);
        } else {
          console.error("Failed to fetch user details");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, [userId]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Logout Handler
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        sessionStorage.removeItem("authToken");
        sessionStorage.removeItem("userId");
        logout();
        router.push("/auth/login");
      } else {
        console.error("Failed to logout");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (

    <nav>
      {/* Top Navbar for Large Screens */}
      <div className="hidden sm:flex h-14 w-full justify-between px-10 items-center bg-[rgba(240,244,255,0.7)] dark:bg-[rgba(11,14,31,0.7)] backdrop-blur-md z-[99]  fixed top-0 left-0">
        {/*--------------- Logo ----------------*/}
        <Link href="/" className="text-lg font-bold hover:text-gray-400">
          O1B
        </Link>

        {/* Navigation Links */}
        <ul className="flex space-x-10 items-center">
          {/*--------------- Home ------------------*/}
          <li>
            <Link href="/" className="flex items-center gap-2 hover:text-gray-400 transition">
              <FaHome size={20} />
              <span>Home</span>
            </Link>
          </li>



          {/*--------------- Support ---------------*/}

          {
            !userId && (
              <li>
                <Link href="/support" className="flex items-center gap-2 hover:text-gray-400 transition">
                  <FaHeadset />
                  <span className="hidden sm:inline">Support</span>
                </Link>
              </li>
            )
          }


          {/*--------------- Login ---------------*/}

          {
            !userId && (
              <li>
                <Link href="/auth/login" className="flex items-center gap-2 hover:text-gray-400 transition">
                  <FaSignInAlt />
                  <span className="hidden sm:inline">Login</span>
                </Link>
              </li>
            )
          }


          {/*------------------ Notifications --------------------*/}
          <li>
            {userId && (
              <div className="relative flex items-center">
                <Notifications />

              </div>
            )}
          </li>

          {/*------------------ Profile --------------------*/}
          <li>
            {userId && (
              <Link
                href="/users"
                className="flex items-center gap-2 hover:text-gray-400 transition"
              >
                <FaUserCircle size={20} />
                <span>Profile</span>
              </Link>
            )}
          </li>

          {/*---------------------- Wallet ------------------------*/}
          <li>
            {userId && (<Link href="/wallet" className="flex items-center gap-2 text-lg hover:text-gray-400 transition">
              Wallet
            </Link>)}
          </li>


          {/*----------------------- Logout ------------------------*/}
          <li>
            {userId && (<button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-lg text-red-500  hover:text-red-700"
            >
              Logout
            </button>)}
          </li>
        </ul>
      </div>


      {/* Top Navbar for Mobile Screens */}
      <div>
        <ul className="sm:hidden h-14 w-full flex justify-between px-5 items-center bg-[rgba(240,244,255,0.7)] dark:bg-[rgba(11,14,31,0.7)] backdrop-blur-md z-[99] fixed top-0 left-0">


          <li> <Link href="/" className="text-lg font-bold hover:text-gray-400">
            O1B
          </Link></li>

          {/*<---------------------------------- Notifications -------------------------------> */}
          <li> {userId && (
            <div className="relative flex items-center">
              <Notifications />
            </div>
          )}</li>


          {/*--------------- Support ---------------*/}

          {
            !userId && (
              <li>
                <Link href="/support" className="flex items-center gap-2 hover:text-gray-400 transition">
                  <FaHeadset />
                  <span className="hidden sm:inline">Support</span>
                </Link>
              </li>
            )
          }

        </ul>
      </div>




      {/*------------------ Bottom Navbar for Mobile Screens --------------------------*/}
      <div className="sm:hidden h-14 w-full flex justify-between px-5 items-center bg-[rgba(240,244,255,0.7)] dark:bg-[rgba(11,14,31,0.7)] backdrop-blur-md z-[99] fixed bottom-0 left-0">
        <ul className="flex w-full justify-between">
          <li>
            {userId && (
              <Link
                href="/users"
                className="flex flex-col items-center gap-1 hover:text-gray-400 transition"
              >
                <FaUserCircle size={20} />
                <span className="text-xs">Profile</span>
              </Link>
            )}
          </li>

          <li>
            {userId && (
              <Link
                href="/rentalhistory"
                className="flex flex-col items-center gap-1 hover:text-gray-400 transition"
              >
                <FaHistory size={20} />
                <span className="text-xs">Orders</span>
              </Link>
            )}
          </li>

          <li>
            {userId && (
              <Link
                href="/productlist"
                className="flex flex-col items-center gap-1 hover:text-gray-400 transition"
              >
                <FaProjectDiagram size={20} />
                <span className="text-xs">Shops</span>
              </Link>
            )}
          </li>


          <li>
            {userId && (
              <Link
                href="/support"
                className="flex flex-col items-center gap-1 hover:text-gray-400 transition"
              >
                <FaHeadset size={20} />
                <span className="text-xs">Support</span>
              </Link>
            )}
          </li>

          <li>
            {userId && (
              <Link
                href="/wallet"
                className="flex flex-col items-center gap-1 hover:text-gray-400 transition"
              >
                <FaWallet size={20} />
                <span className="text-xs">Wallet</span>
              </Link>
            )}
          </li>








          {/*----------------------- LogIn -------------------------*/}
          {!userId && (
            <div className="sm:hidden h-14 w-full flex justify-between px-5 items-center bg-[rgba(240,244,255,0.7)] dark:bg-[rgba(11,14,31,0.7)] backdrop-blur-md z-[99] fixed bottom-0 left-0">
              <ul className="flex w-full justify-around">
                <li>
                  <Link
                    href="/"
                    className="flex flex-col items-center gap-1 hover:text-gray-400 transition"
                  >
                    <FaHome size={20} />
                    <span className="text-xs">Home</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth/login"
                    className="flex flex-col items-center gap-1 text-blue-500 hover:text-gray-400 transition"
                  >
                    <FaSignInAlt size={20} />
                    <span className="text-xs">Login</span>
                  </Link>
                </li>
              </ul>
            </div>
          )}

          {/*----------------------- Logout ------------------------*/}
          {/* <li>
            {userId && (<button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-lg text-red-500  hover:text-red-700"
            >
              Logout
            </button>)}
          </li> */}

        </ul>
      </div>
    </nav>


  );
};

export default Navbar;















// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import Link from "next/link";
// import { useAuthContext } from "@/app/context/AuthContext";
// import { useRouter } from "next/navigation";
// import { FaHome, FaSignInAlt, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
// import Notifications from "./Notification";

// interface UserDetails {
//   name: string;
//   email: string;
//   [key: string]: any;
// }

// const Navbar = () => {
//   const { userId } = useAuthContext();
//   const router = useRouter();
//   const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
//   const [loading, setLoading] = useState(true);
//   const { logout } = useAuthContext();
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   const dropdownRef = useRef<HTMLDivElement>(null);

//   // Fetch User Details
//   useEffect(() => {
//     const fetchUserDetails = async () => {
//       if (!userId) {
//         setLoading(false);
//         return;
//       }
//       try {
//         const res = await fetch(`/api/users/${userId}`, {
//           method: "GET",
//           credentials: "include",
//         });
//         if (res.ok) {
//           const data = await res.json();
//           setUserDetails(data);
//         } else {
//           console.error("Failed to fetch user details");
//         }
//       } catch (error) {
//         console.error("Error fetching user details:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUserDetails();
//   }, [userId]);

//   // Close dropdown on outside click
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setDropdownOpen(false);
//       }
//     };

//     document.addEventListener("click", handleClickOutside);
//     return () => {
//       document.removeEventListener("click", handleClickOutside);
//     };
//   }, []);

//   // Logout Handler
//   const handleLogout = async () => {
//     try {
//       const response = await fetch("/api/auth/logout", {
//         method: "POST",
//         credentials: "include",
//       });
//       if (response.ok) {
//         sessionStorage.removeItem("authToken");
//         sessionStorage.removeItem("userId");
//         logout();
//         router.push("/auth/login");
//       } else {
//         console.error("Failed to logout");
//       }
//     } catch (error) {
//       console.error("Error during logout:", error);
//     }
//   };

//   return (

//     <nav className="h-14 w-full flex border-b sm:border-none justify-between px-5 sm:px-0 sm:justify-around items-center bg-[rgba(240,244,255,0.7)] dark:bg-[rgba(11,14,31,0.7)] backdrop-blur-md z-[99] fixed sm:top-0 sm:left-0 bottom-0 sm:bottom-auto">

//       <Link href="/" className="text-lg font-bold hover:text-gray-400">
//         O1B
//       </Link>

//       <ul className="flex space-x-6 items-center relative">
//         <li>
//           <Link href="/" className="flex items-center gap-2 hover:text-gray-400 transition">
//             <FaHome />
//             <span className="hidden sm:inline">Home</span>
//           </Link>
//         </li>
//         {loading ? (
//           <span className="text-yellow-400"></span>
//         ) : userId && userDetails && (
//           <span className="text-green-400 hidden sm:inline">
//             Welcome, {userDetails.name}
//           </span>
//         )}
//         {!userId && (
//           <li>
//             <Link href="/auth/login" className="flex items-center gap-2 hover:text-gray-400 transition">
//               <FaSignInAlt />
//               <span className="hidden sm:inline">Login</span>
//             </Link>
//           </li>
//         )}

//         {/* Notifications */}

//         {userId &&
//           (<Notifications />)
//         }
//         {userId && (
//           <li>
//             <div className="relative" ref={dropdownRef}>
//               <button
//                 onClick={() => setDropdownOpen(!dropdownOpen)}
//                 className="text-blue-400 flex items-center gap-2 hover:text-gray-400"
//               >
//                 <FaUserCircle />
//                 <span className="hidden sm:inline">Profile</span>
//               </button>

//               {/* Dropdown */}
//               {dropdownOpen && (
//                 <div
//                   className="absolute right-0 mt-2 sm:mt-0 sm:top-full sm:right-0 sm:translate-y-0 -translate-y-full w-40 bg-white dark:bg-gray-800 shadow-md rounded-md py-2 z-10"
//                 >
//                   <p className="px-4 py-2 text-sm text-gray-600 dark:text-gray-200">
//                     <Link
//                       href="/users"
//                       onClick={() => setDropdownOpen(false)} // Close the dropdown
//                     >
//                       {userDetails?.name}
//                     </Link>
//                   </p>
//                   <button
//                     onClick={handleLogout}
//                     className="w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
//                   >
//                     <FaSignOutAlt className="inline mr-2" />
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           </li>
//         )}
//       </ul>
//     </nav>

//   );
// };

// export default Navbar;
