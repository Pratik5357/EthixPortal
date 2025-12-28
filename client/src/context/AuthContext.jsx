import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem("ethix_user");

      if (!storedUser) {
        setStatus("unauthenticated");
        return;
      }

      try {
        const res = await api.post("/users/refresh-token");

        localStorage.setItem("ethix_token", res.data.accessToken);
        setUser(JSON.parse(storedUser));
        setStatus("authenticated");
      } catch {
        localStorage.removeItem("ethix_user");
        localStorage.removeItem("ethix_token");
        setStatus("unauthenticated");
      }
    };

    initAuth();
  }, []);

  const login = async (payload) => {
    const res = await api.post("/users/login", payload);

    localStorage.setItem("ethix_token", res.data.accessToken);
    localStorage.setItem("ethix_user", JSON.stringify(res.data.user));

    setUser(res.data.user);
    setStatus("authenticated");
  };

  const logout = async () => {
    try {
      await api.post("/users/logout");
    } catch {}

    localStorage.clear();
    setUser(null);
    setStatus("unauthenticated");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, status }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);