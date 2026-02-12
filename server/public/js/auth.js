// public/js/auth.js
import { API } from "./api.js";

const TOKEN_KEY = "token";

export const Auth = {
  setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },
  logout() {
    localStorage.removeItem(TOKEN_KEY);
  },

  // JWT decode (без backend /me)
  getUserFromToken() {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = token.split(".")[1];
      const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
      const data = JSON.parse(json);

      // { id, email, role, iat, exp }
      if (data?.exp && Date.now() / 1000 > data.exp) {
        this.logout();
        return null;
      }
      return data;
    } catch {
      return null;
    }
  },

  isLoggedIn() {
    return !!this.getUserFromToken();
  },
  isAdmin() {
    return this.getUserFromToken()?.role === "admin";
  },

  async login(email, password) {
    const data = await API.post("/api/auth/login", { email, password });
    if (data?.token) this.setToken(data.token);
    return data;
  },

  async register(email, password) {
    const data = await API.post("/api/auth/register", { email, password });
    if (data?.token) this.setToken(data.token);
    return data;
  },
};
