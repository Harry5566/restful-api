"use client";

import { useContext, createContext, useState, useEffect } from "react";

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
        const token = result.data.token;
        setUser(result.data.user);
        localStorage.setItem(appKey, token);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const API = "http://localhost:3005/api/users/status";
    const token = localStorage.getItem(appKey);
    if (!token) {
      setUser(null);
      return;
    }
    const checkToken = async () => {
      try {
        const res = await fetch(API, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await res.json();

        if (result.status == "success") {
          const token = result.data.token;
          setUser(result.data.user);
          localStorage.setItem(appKey, token);
        } else {
          alert(result.message);
        }
      } catch (error) {
        console.log(`解析 token 失敗 ${error.message}`);
        setUser(null);
        localStorage.removeItem(appKey);
      }
    };

    checkToken();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
