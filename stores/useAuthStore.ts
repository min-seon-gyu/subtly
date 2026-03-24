import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { API_BASE_URL } from '../constants/config';

interface AuthState {
  token: string | null;
  nickname: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, nickname: string) => Promise<void>;
  logout: () => Promise<void>;
  loadToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  nickname: null,
  isLoading: true,

  loadToken: async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      const nickname = await SecureStore.getItemAsync('nickname');
      set({ token, nickname, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  login: async (email, password) => {
    const res = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
    const { accessToken, nickname } = res.data;
    await SecureStore.setItemAsync('token', accessToken);
    await SecureStore.setItemAsync('nickname', nickname);
    set({ token: accessToken, nickname });
  },

  signup: async (email, password, nickname) => {
    const res = await axios.post(`${API_BASE_URL}/api/auth/signup`, { email, password, nickname });
    const { accessToken, nickname: name } = res.data;
    await SecureStore.setItemAsync('token', accessToken);
    await SecureStore.setItemAsync('nickname', name);
    set({ token: accessToken, nickname: name });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('nickname');
    set({ token: null, nickname: null });
  },
}));
