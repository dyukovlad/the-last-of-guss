import { useStore } from '../store/store';

export const useAuth = () => {
  const user = useStore(state => state.user);
  const token = useStore(state => state.token);
  const login = useStore(state => state.login);
  const logout = useStore(state => state.logout);
  const loading = useStore(state => state.loading);
  const error = useStore(state => state.error);

  return { user, token, login, logout, loading, error };
};