/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import axios from 'axios';
import type {
  StoreState,
  User,
  Round,
  RoundResponse,
  TapResponse,
  LoginResponse,
} from '../types';
import { API_BASE_URL } from '../constants/api';

// Create the store
export const useStore = create<StoreState>((set, get) => ({
  user: null,
  rounds: [],
  error: null,
  loading: false,
  token: null,

  login: async (username: string, password: string) => {
    set({ loading: true, error: null });

    try {
      // Login using correct API path from OpenAPI documentation
      const response = await axios.post(`${API_BASE_URL}/api/v1/auth/login`, {
        username,
        password,
      });

      const loginData: LoginResponse = response.data;
      const token = loginData.token;

      // Set token in axios defaults for subsequent requests
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }

      // Create user object based on API response format
      const isAdmin = loginData.role === 'ADMIN';
      const user: User = {
        id: 0, // API doesn't return id in login response, using placeholder
        username: loginData.username,
        balance: 0, // API doesn't return balance in login response, using placeholder
        token,
        isAdmin,
      };

      set({ user, token, loading: false });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Login failed';

      set({
        error: errorMessage,
        loading: false,
        user: null,
        token: null,
      });

      // Удаляем заголовок авторизации при ошибке
      delete axios.defaults.headers.common['Authorization'];
    }
  },

  logout: () => {
    // Remove authorization header
    delete axios.defaults.headers.common['Authorization'];
    set({ user: null, token: null, error: null });
  },

  fetchRounds: async () => {
    const token = get().token;

    if (!token) {
      throw new Error('No authentication token available');
    }

    set({ loading: true });

    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/rounds`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // The API returns a paginated response
      const data = response.data;
      const rounds: RoundResponse[] = data.data || response.data; // Handle both paginated and non-paginated responses

      // Transform to our internal Round type
      const transformedRounds: Round[] = rounds.map((r) => ({
        id: r.id,
        startTime: r.startTime,
        endTime: r.endTime,
        totalScore: r.totalScore,
        createdAt: r.createdAt,
      }));

      set({ rounds: transformedRounds, loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch rounds',
        loading: false,
      });
      throw error;
    }
  },

  createRound: async () => {
    const token = get().token;

    if (!token) {
      throw new Error('No authentication token available');
    }

    set({ loading: true });

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/rounds`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const newRound: RoundResponse = response.data;

      // Transform to our internal Round type
      const transformedRound: Round = {
        id: newRound.id,
        startTime: newRound.startTime,
        endTime: newRound.endTime,
        totalScore: newRound.totalScore,
        createdAt: newRound.createdAt,
      };

      // Update the local state with the new round
      set((state) => ({
        rounds: [...state.rounds, transformedRound],
        loading: false,
      }));

      return newRound; // Return the created round
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create round',
        loading: false,
      });
      throw error;
    }
  },

  tapGoose: async (roundId: string) => {
    const token = get().token;

    if (!token) {
      throw new Error('No authentication token available');
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/rounds/${roundId}/tap`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const tapResult: TapResponse = response.data;

      // Update the specific round with the new tap and score count
      set((state) => ({
        rounds: state.rounds.map((round) =>
          round.id === roundId
            ? {
                ...round,
                taps: tapResult.taps,
                score: tapResult.score,
              }
            : round
        ),
        user: state.user
          ? {
              ...state.user,
              balance: tapResult.score, // Assuming score relates to user balance
            }
          : null,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to tap goose',
        loading: false,
      });
      throw error;
    }
  },

  fetchRoundDetails: async (roundId: string) => {
    const token = get().token;

    if (!token) {
      throw new Error('No authentication token available');
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/rounds/${roundId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch round details',
        loading: false,
      });
      throw error;
    }
  },
}));
