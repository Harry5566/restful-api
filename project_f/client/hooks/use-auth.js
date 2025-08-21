"use client";

import { useContext, createContext, useState } from "react";
import jwt from "jsonwebtoken";

const AuthContext = createContext(null);
AuthContext.displayName = "AuthContext";
const appKey = "reactLoginToken";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (account, password) => {
    console.log(`在 use-auth 中, ${account}, ${password}`);
    const API = "http://localhost:3005/api/users/login";
    const formData = new FormData();
    formData.append("account", account);
    formData.append("password", password);
    try {
      const res = await fetch(API, {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      console.log(result);

      if (result.status == "success") {
        console.log("成功");
        
      } else {
        console.log("失敗");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
