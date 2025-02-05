import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getSession, signOut } from "next-auth/react";
import axios from "axios";

// Define user type
type User = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
} | null;

interface AuthState {
  token: string | null;
  user: any | null;
  error: string | null;
}

// Fetch user session from NextAuth
export const fetchUserSession = createAsyncThunk<User>(
  "auth/fetchSession",
  async () => {
    const session = await getSession();
    return session?.user || null;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null as User },
  reducers: {
    loginUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    logoutUser: (state) => {
      state.user = null;
      signOut(); // Logs out from NextAuth
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserSession.fulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
});

export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (updatedData: { email?: string; name?: string; password?: string; avatar?: string }, thunkAPI) => {
    const { auth } = thunkAPI.getState() as { auth: AuthState };
    if (!auth.token || !auth.user) return thunkAPI.rejectWithValue("No token or user data found");

    try {
      const response = await axios.put(`https://api.escuelajs.co/api/v1/users/${auth.user.id}`, updatedData, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to update profile");
    }
  }
);

export const { loginUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
