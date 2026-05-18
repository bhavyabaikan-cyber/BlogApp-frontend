import { create } from "zustand";
import axios from "axios";
import { API_BASE_URL } from "./apiUrl";

export const useAuth = create((set) => ({
  currentUser: null, loading: false, isAuthenticated: false, error: null,
  login: async (userCred) => {
    try {
      set({ loading: true, currentUser: null, isAuthenticated: false, error: null });
      const res = await axios.post(`${API_BASE_URL}/auth/login`, userCred, { withCredentials: true });
      if (res.status === 200) set({ currentUser: res.data?.payload, loading: false, isAuthenticated: true, error: null });
    } catch (err) {
      set({ loading: false, isAuthenticated: false, currentUser: null, error: err.response?.data?.error || "Login failed" });
    }
  },
  logout: async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/auth/logout`, { withCredentials: true });
      if (res.status === 200) set({ currentUser: null, isAuthenticated: false, error: null, loading: false });
    } catch (err) { set({ loading: false, isAuthenticated: false, currentUser: null, error: err.response?.data?.error || "Logout failed" }); }
  },
  checkAuth: async () => {
    try {
      set({ loading: true });
      const res = await axios.get(`${API_BASE_URL}/auth/check-auth`, { withCredentials: true });
      set({ currentUser: res.data.payload, isAuthenticated: true, loading: false });
    } catch (err) {
      if (err.response?.status === 401) { set({ currentUser: null, isAuthenticated: false, loading: false }); return; }
      console.error("Auth check failed:", err);
      set({ loading: false });
    }
  },
}));