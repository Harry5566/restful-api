"use client";

import { useContext, createContext, useState } from "react";

const AuthContext = createContext(null);
AuthContext.displayName = "AuthContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  return(
    <AuthContext.Provider value={{user}}>
      { children }
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);

