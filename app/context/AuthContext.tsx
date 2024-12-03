"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";

interface AuthContextType {
  userId: string | null;
  authToken: string | null;
  walletId: string | null;
  userRole: string | null;
  userName: string | null;
  login: (id: string, token: string, wId: string, userRole: string,userName : string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { authToken, login: authLogin, logout: authLogout } = useAuth();
  const [userId, setUserId] = React.useState<string | null>(null);
  const [walletId, setwalletId] = React.useState<string | null>(null);
  const [userRole, setuserRole] = React.useState<string | null>(null);
  const [userName, setuserName] = React.useState<string | null>(null);

  const login = (id: string, token: string, wId: string, userRole: string,userName : string) => {
    console.log(userName);
    setUserId(id);
    authLogin(token); // Use useAuth's login function
    setwalletId(wId);
    setuserRole(userRole);
    setuserName(userName);
    sessionStorage.setItem("userId", id);
    sessionStorage.setItem("walletId", wId);
    sessionStorage.setItem("userRole", userRole);
    sessionStorage.setItem("userName", userName);

  };

  const logout = () => {
    setUserId(null);
    authLogout(); // Use useAuth's logout function
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("walletId");
    sessionStorage.removeItem("userRole");
    sessionStorage.removeItem("userName");
  };

  React.useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    const storedWalletId = sessionStorage.getItem("walletId");
    const storedUserRole = sessionStorage.getItem("userRole");
    const storedUserName = sessionStorage.getItem("userName");
    if (storedUserId) {
      setUserId(storedUserId);
    }
    if (storedWalletId) {
      setwalletId(storedWalletId);
    }
    if (storedUserRole) {
      setuserRole(storedUserRole);
    }
    if (storedUserName) {
      setuserName(storedUserName);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ userId, authToken,walletId,userRole,userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};







// "use client";
// import React, { createContext, useContext, useState, ReactNode } from 'react';

// interface UserContextType {
//   userId: string | null;
//   setUserId: (id: string | null) => void;
// }

// const UserContext = createContext<UserContextType | undefined>(undefined);

// export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [userId, setUserId] = useState<string | null>(null);

//   return (
//     <UserContext.Provider value={{ userId, setUserId }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = (): UserContextType => {
//   const context = useContext(UserContext);
//   if (!context) {
//     throw new Error('useUser must be used within a UserProvider');
//   }
//   return context;
// };
