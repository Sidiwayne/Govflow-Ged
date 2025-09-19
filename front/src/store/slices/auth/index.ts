import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, User } from "../../../types/auth";
import { loginUser, registerUser, logoutUser, checkAuthStatus } from "./thunks";

const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  };
  
  const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      clearError: (state) => {
        state.error = null;
      },
      updateUser: (state, action: PayloadAction<Partial<User>>) => {
        if (state.user) {
          state.user = { ...state.user, ...action.payload };
          // Update localStorage
          localStorage.setItem('user', JSON.stringify(state.user));
        }
      },
    },
    extraReducers: (builder) => {
      builder
        // Login
        .addCase(loginUser.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.error = null;
        })
        .addCase(loginUser.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.error.message || 'Login failed';
        })
        
        // Register
        .addCase(registerUser.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(registerUser.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.error = null;
        })
        .addCase(registerUser.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.error.message || 'Registration failed';
        })
        
        // Logout
        .addCase(logoutUser.fulfilled, (state) => {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
          state.error = null;
        })
        
        // Check auth status
        .addCase(checkAuthStatus.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(checkAuthStatus.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.error = null;
        })
        .addCase(checkAuthStatus.rejected, (state) => {
          state.isLoading = false;
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
        });
    },
  });
  
  export const { clearError, updateUser } = authSlice.actions;
  export default authSlice.reducer;
  