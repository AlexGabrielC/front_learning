import axios from "axios";

// Define API base URL
const API_URL = "https://api.escuelajs.co/api/v1/users";

const isValidImageUrl = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch {
    return false;
  }
};

const transformUserData = (user: any) => ({
  ...user,
  avatar: isValidImageUrl(user.avatar) ? user.avatar : "/default-avatar.png",
});

export const UserService = {
  // 🔹 Get all users (Admin only)
  getAllUsers: async (token: string) => {
    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.map(transformUserData);
    } catch (error) {
      throw new Error("Unauthorized: Admin access required");
    }
  },

  // 🔹 Get a single user by ID
  getUserById: async (id: number, token: string) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return transformUserData(response.data);
    } catch (error) {
      throw new Error("Failed to fetch user details");
    }
  },

  // 🔹 Create a new user (Signup)
  createUser: async (userData: { name: string; email: string; password: string; avatar: string }) => {
    try {
      const response = await axios.post(API_URL, userData);
      return transformUserData(response.data);
    } catch (error) {
      throw new Error("Failed to create user");
    }
  },

  // 🔹 Update user details (Only API users can update, NOT Google users)
  updateUser: async (id: number, updateData: { email?: string; passwoord?: string; name?: string; avatar?: string }, token: string) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return transformUserData(response.data);
    } catch (error) {
      throw new Error("Unauthorized: Cannot update user details");
    }
  },

  checkEmailAvailability: async (email: string) => {
    try {
      const response = await axios.post(`${API_URL}/users/is-available`, { email });
      return response.data.isAvailable; 
    } catch (error) {
      throw new Error("Failed to check email availability.");
    }
  }
  
};
