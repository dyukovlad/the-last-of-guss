import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import {
  Container,
  Typography,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from '@mui/material';
import { useStore } from './store/store';
import LoginPage from './pages/LoginPage';
import RoundListPage from './pages/RoundListPage';
import RoundPage from './pages/RoundPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#e57373',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function App() {
  const user = useStore(state => state.user);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h1" align="center" gutterBottom>
          The Last of Guss
        </Typography>
        <Router>
          <Routes>
            <Route
              path="/"
              element={user ? <Navigate to="/rounds" /> : <LoginPage />}
            />
            <Route
              path="/login"
              element={user ? <Navigate to="/rounds" /> : <LoginPage />}
            />
            <Route
              path="/rounds"
              element={user ? <RoundListPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/round/:roundId"
              element={user ? <RoundPage /> : <Navigate to="/login" />}
            />
          </Routes>
        </Router>
      </Container>
    </ThemeProvider>
  );
}

export default App;
