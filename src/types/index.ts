export interface LoginResponse {
  username: string;
  role: 'SURVIVOR' | 'NIKITA' | 'ADMIN';
  token: string;
}

export interface User {
  id: number;
  username: string;
  balance: number;
  token?: string;
  isAdmin?: boolean;
}

export interface RoundResponse {
  id: string;
  startTime: string;
  endTime: string;
  totalScore: number;
  createdAt: string;
}

export interface RoundDetailsResponse {
  round: RoundResponse;
  topStats: Array<{
    taps: number;
    score: number;
    user: {
      username: string;
    };
  }>;
  myStats: {
    taps: number;
    score: number;
  };
}

export interface Round {
  id: string;
  startTime: string;
  endTime: string;
  totalScore: number;
  createdAt: string;
  taps?: number;
  score?: number;
}

export interface TapResponse {
  taps: number;
  score: number;
}

export interface StoreState {
  user: User | null;
  rounds: Round[];
  error: string | null;
  loading: boolean;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  fetchRounds: () => Promise<void>;
  createRound: () => Promise<RoundResponse>;
  tapGoose: (roundId: string) => Promise<void>;
  fetchRoundDetails: (roundId: string) => Promise<RoundDetailsResponse>;
}