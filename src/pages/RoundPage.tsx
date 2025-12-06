import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth, useRounds } from '../hooks';
import {
  Container,
  Typography,
  Box,
  Alert,
  Button,
  Card,
  CardContent,
  CardHeader,
} from '@mui/material';

const RoundPage: React.FC = () => {
  const { roundId } = useParams<{ roundId: string }>();
  const navigate = useNavigate();
  const [round, setRound] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState<number>(Date.now());
  const [myScore, setMyScore] = useState<number>(0);

  const { user, error } = useAuth();
  const { tapGoose, fetchRoundDetails } = useRounds();

  // Set up a timer to update the time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    // Clean up the interval
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (roundId) {
      // Fetch detailed round information
      fetchRoundDetails(roundId)
        .then((details: any) => {
          // Update the round state with detailed information
          setRound({
            ...details.round,
            taps: details.myStats.taps,
            score: details.myStats.score,
            topStats: details.topStats,
          });
          setMyScore(details.myStats.score || 0);
        })
        .catch((err: any) => {
          console.error('Failed to fetch round details:', err);
        });
    }
  }, [roundId, fetchRoundDetails]);

  const handleTap = async () => {
    if (!roundId || !round) return;

    const now = new Date();
    const start = new Date(round.startTime);
    const end = new Date(round.endTime);

    const isRoundActive = now >= start && now <= end;

    if (!isRoundActive) {
      console.error('Round is not active');
      return;
    }

    try {
      await tapGoose(roundId); // roundId is already a string from useParams

      // Refresh the round details to get updated score
      fetchRoundDetails(roundId)
        .then((details: any) => {
          setRound({
            ...details.round,
            taps: details.myStats.taps,
            score: details.myStats.score,
            topStats: details.topStats,
          });
          setMyScore(details.myStats.score || 0);
        })
        .catch((err: any) => {
          console.error('Failed to fetch round details:', err);
        });
    } catch (err) {
      console.error('Failed to tap goose:', err);
    }
  };

  if (!round) {
    return (
      <Container maxWidth="sm">
        <Alert severity="info">Loading round details...</Alert>
      </Container>
    );
  }

  // Calculate current time and round status
  const start = new Date(round.startTime).getTime();
  const end = new Date(round.endTime).getTime();

  const isRoundActive = currentTime >= start && currentTime <= end;
  const isRoundFinished = currentTime > end;
  const isRoundWaiting = currentTime < start;

  // Calculate time left or time until start
  let timeLeftStr = '';
  let statusHeader = '';
  let statusText = '';

  if (isRoundWaiting) {
    statusHeader = 'Cooldown';
    statusText = 'до начала раунда';
    const diff = Math.max(0, Math.floor((start - currentTime) / 1000));
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;

    timeLeftStr = `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  } else if (isRoundActive) {
    statusHeader = 'Раунд активен!';
    statusText = 'До конца осталось';
    const diff = Math.max(0, Math.floor((end - currentTime) / 1000));
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    timeLeftStr = `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  } else {
    statusHeader = 'Раунд завершен';
    statusText = 'Раунд завершен';
    timeLeftStr = '00:00';
  }

  return (
    <Container maxWidth="sm">
      <Card
        sx={{
          boxShadow: 3,
          overflow: 'hidden',
          fontFamily: 'monospace',
          border: '2px solid #ccc',
        }}
      >
        <CardHeader
          title={
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">
                {isRoundWaiting
                  ? 'Cooldown'
                  : isRoundFinished
                  ? 'Раунд завершен'
                  : 'Раунды'}
              </Typography>
              <Typography variant="h6">{user?.username || 'Игрок'}</Typography>
            </Box>
          }
          sx={{
            backgroundColor: '#f0f0f0',
            borderBottom: '1px solid #ccc',
          }}
        />

        <CardContent
          sx={{
            textAlign: 'center',
            py: 3,
            position: 'relative',
          }}
        >
          <Box
            sx={{
              mb: 3,
              mx: 'auto',
              width: 'fit-content',
              position: 'relative',
            }}
            onClick={isRoundActive ? handleTap : undefined}
            style={isRoundActive ? { cursor: 'pointer' } : {}}
          >
            <svg
              width="200"
              height="150"
              viewBox="0 0 200 150"
              style={isRoundActive ? { cursor: 'pointer' } : {}}
            >
              <rect width="200" height="150" fill="white" />
              <path
                d="M30,75 L40,65 L50,60 L60,55 L70,50 L80,48 L90,47 L100,46 L110,47 L120,48 L130,50 L140,55 L150,60 L160,65 L170,75 L160,85 L150,90 L140,95 L130,100 L120,102 L110,103 L100,104 L90,103 L80,102 L70,100 L60,95 L50,90 L40,85 Z"
                fill="#8B4513"
              />
              <circle cx="80" cy="70" r="5" fill="black" />
              <circle cx="120" cy="70" r="5" fill="black" />
              <ellipse cx="100" cy="85" rx="15" ry="8" fill="orange" />
              <path
                d="M60,90 Q100,110 140,90"
                stroke="#8B4513"
                strokeWidth="5"
                fill="none"
              />
            </svg>
          </Box>

          {isRoundFinished ? (
            <>
              <Typography variant="body1" sx={{ mt: 2, fontWeight: 'bold' }}>
                {statusHeader}
              </Typography>

              <Box
                sx={{
                  borderTop: '1px solid #ccc',
                  mb: 2,
                  width: '100%',
                  mt: 2,
                }}
              ></Box>
              <Typography variant="body1" gutterBottom>
                Всего {round.totalScore || 0}
              </Typography>
              {round.topStats && round.topStats.length > 0 && (
                <Typography variant="body1" gutterBottom>
                  Победитель - {round.topStats[0].user.username}{' '}
                  {round.topStats[0].score}
                </Typography>
              )}
              <Typography variant="body1">Мои очки {myScore || 0}</Typography>
            </>
          ) : (
            <>
              <Typography variant="body1" sx={{ mt: 2, fontWeight: 'bold' }}>
                {statusHeader}
              </Typography>

              <Typography variant="body1">
                {statusText} {timeLeftStr}
              </Typography>

              <Typography variant="body1" sx={{ mt: 1 }}>
                Мои очки {myScore || 0}
              </Typography>

              {isRoundActive && (
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleTap}
                  sx={{
                    mt: 2,
                    fontSize: '1rem',
                    padding: '8px 24px',
                    backgroundColor: '#4caf50',
                    '&:hover': {
                      backgroundColor: '#388e3c',
                    },
                  }}
                >
                  НАЖМИ МЕНЯ!
                </Button>
              )}
            </>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </CardContent>
      </Card>

      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Button variant="outlined" onClick={() => navigate('/rounds')}>
          Назад к раундам
        </Button>
      </Box>
    </Container>
  );
};

export default RoundPage;
