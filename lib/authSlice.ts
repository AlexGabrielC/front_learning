import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AuthService } from "@/services/AuthService";
import { getSession } from "next-auth/react";

interface UserState {
  name: string;
  email: string;
  avatar: string;
  password : string;
  role : string;
  token: string | null;
}

interface AuthState {
  user: UserState | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

// Fetch API user session
export const fetchUserSession = createAsyncThunk(
  "auth/fetchUserSession",
  async (token: string, thunkAPI) => {
    try {
      const profile = await AuthService.getProfile(token);
      return { ...profile, token };
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch session");
    }
  }
);

// Login API User
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }: { email: string; password: string }, thunkAPI) => {
    try {
      const response = await AuthService.login(email, password);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue("Login failed. Check your credentials.");
    }
  }
);

// Login Google User
export const loginWithGoogle = createAsyncThunk(
  "auth/loginWithGoogle",
  async (_, thunkAPI) => {
    try {
      const session = await getSession();
      if (!session || !session.user) {
        throw new Error("Google user session not found");
      }
      return {
        name: session.user.name || "Google User",
        email: session.user.email || "",
        avatar: session.user.image || "/default-avatar.png",
        password: "",
        role: "customer",
        token: null,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to retrieve Google user data.");
    }
  }
);

// Logout User
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  return null;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserSession.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchUserSession.rejected, (state) => {
        state.user = null;
        state.error = "Failed to fetch session";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default authSlice.reducer;
