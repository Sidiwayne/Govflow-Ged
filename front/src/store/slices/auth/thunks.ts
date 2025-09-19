import { createAsyncThunk } from '@reduxjs/toolkit';
import { User, LoginCredentials, RegisterData } from '../../../types/auth';

// Mock API calls - replace with real API endpoints
const mockLogin = async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock user data - replace with real API response
  const mockUser: User = {
    id: '1',
    firstname: 'John',
    lastname: 'Doe',
    email: credentials.email,
    password: '',
    phone_number: '+1234567890',
    role: 'secretaire',
    entity: {
      id: 'secretariat',
      name: 'Secretariat',
      description: 'Secretariat de la Présidence',
      main_user: null,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  const mockToken = 'mock-jwt-token-' + Date.now();
  
  return { user: mockUser, token: mockToken };
};

const mockRegister = async (data: RegisterData): Promise<{ user: User; token: string }> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const mockUser: User = {
    id: Date.now().toString(),
    ...data,
    phone_number: data.phone_number || null,
    password: '',
    entity: {
      id: 'secretariat',
      name: 'Secretariat',
      description: 'Secretariat de la Présidence',
      main_user: null,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  const mockToken = 'mock-jwt-token-' + Date.now();
  
  return { user: mockUser, token: mockToken };
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials) => {
    const response = await mockLogin(credentials);
    // Store token in localStorage
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    return response;
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: RegisterData) => {
    const response = await mockRegister(data);
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    return response;
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
);

export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      const user = JSON.parse(userStr);
      return { user, token };
    }
    
    throw new Error('No valid session found');
  }
);