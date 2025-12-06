import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useRounds } from '../hooks';
import {
  Container,
  Typography,
  List,
  ListItem,
  Button,
  Box,
  Alert,
  Link,
  Card,
  CardContent,
  Divider
} from '@mui/material';

const RoundListPage: React.FC = () => {
  const { user, error } = useAuth();
  const { rounds, fetchRounds, createRound, loading } = useRounds();

  const navigate = useNavigate();

  useEffect(() => {
    fetchRounds();
  }, [fetchRounds]);

  const handleCreateRound = async () => {
    if (user?.isAdmin) {
      try {
        // Create a round and get the new round data
        const newRound = await createRound();

        // Navigate directly to the new round page using the returned round ID
        navigate(`/round/${newRound.id}`);
      } catch (error) {
        console.error('Failed to create round:', error);
      }
    }
  };

  // Function to determine round status based on start and end times
  const getRoundStatus = (startTime: string, endTime: string) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (now < start) {
      return 'Cooldown';
    } else if (now >= start && now <= end) {
      return 'Активен';
    } else {
      return 'Завершен';
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{
        border: '2px solid #ccc',
        borderRadius: '4px',
        fontFamily: 'monospace',
        overflow: 'hidden'
      }}>
        <Box sx={{
          backgroundColor: '#f0f0f0',
          borderBottom: '1px solid #ccc',
          p: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h6">Список РАУНДОВ</Typography>
          <Typography variant="h6">{user?.username || 'Игрок'}</Typography>
        </Box>

        <Box sx={{ p: 2 }}>
          {user?.isAdmin && (
            <Box sx={{ mb: 2 }}>
              <Button
                variant="contained"
                onClick={handleCreateRound}
              >
                Создать раунд
              </Button>
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Typography>Loading rounds...</Typography>
          ) : rounds.length === 0 ? (
            <Typography>No rounds available.</Typography>
          ) : (
            <List>
              {rounds.map((round: any) => (
                <ListItem
                  key={round.id}
                  component={Link}
                  href={`/round/${round.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/round/${round.id}`);
                  }}
                  sx={{
                    '&:hover': {
                      backgroundColor: '#f0f0f0',
                      cursor: 'pointer'
                    },
                    p: 0,
                    mb: 2
                  }}
                >
                  <Card sx={{
                    width: '100%',
                    boxShadow: 3,
                    border: '1px solid #ccc',
                    fontFamily: 'monospace'
                  }}>
                    <CardContent>
                      <Typography variant="body1" gutterBottom>
                        ● Round ID: {round.id}
                      </Typography>

                      <Box sx={{ mb: 1 }}>
                        <Typography variant="body2">
                          Start: {new Date(round.startTime).toLocaleString('ru-RU')}
                        </Typography>
                        <Typography variant="body2">
                          End: {new Date(round.endTime).toLocaleString('ru-RU')}
                        </Typography>
                      </Box>

                      <Divider sx={{ my: 1 }} />

                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        Статус: {getRoundStatus(round.startTime, round.endTime)}
                      </Typography>
                    </CardContent>
                  </Card>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default RoundListPage;