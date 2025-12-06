import { Alert, Box } from '@mui/material';

interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
}

export const ErrorDisplay = ({ error, onRetry }: ErrorDisplayProps) => (
  <Box m={2}>
    <Alert
      severity="error"
      action={
        onRetry ? <button onClick={onRetry}>Повторить</button> : undefined
      }
    >
      {error}
    </Alert>
  </Box>
);
