import axios from "axios";

const API_URL = "https://api.escuelajs.co/api/v1";

export const AuthService = {
  // API Login
  login: async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const profile = await axios.get(`${API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${response.data.access_token}` },
      });

      return {
        ...profile.data,
        token: response.data.access_token,
      };
    } catch (error) {
      throw new Error("Invalid email or password.");
    }
  },

  // Get API User Profile
  getProfile: async (token: string) => {
    try {
      const response = await axios.get(`${API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch profile. Please re-login.");
    }
  },
};
