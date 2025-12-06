import { useStore } from '../store/store';

export const useRounds = () => {
  const rounds = useStore(state => state.rounds);
  const fetchRounds = useStore(state => state.fetchRounds);
  const createRound = useStore(state => state.createRound);
  const tapGoose = useStore(state => state.tapGoose);
  const fetchRoundDetails = useStore(state => state.fetchRoundDetails);
  const loading = useStore(state => state.loading);
  const error = useStore(state => state.error);

  return { rounds, fetchRounds, createRound, tapGoose, fetchRoundDetails, loading, error };
};