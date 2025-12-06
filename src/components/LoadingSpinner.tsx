import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner = ({ message }: LoadingSpinnerProps) => (
  <Box 
    display="flex" 
    flexDirection="column" 
    alignItems="center" 
    justifyContent="center" 
    minHeight="200px"
  >
    <CircularProgress />
    {message && (
      <Typography variant="body1" mt={2}>
        {message}
      </Typography>
    )}
  </Box>
);