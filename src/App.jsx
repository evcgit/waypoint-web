import { ThemeProvider } from '@mui/material/styles';
import { Box, Container } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './shared/theme/theme';
import Navbar from './components/Navigation/Navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './routes/Home/Login';
import Explore from './routes/Dashboard/Explore';
import Trips from './routes/Dashboard/Trips';
import Favorites from './routes/Dashboard/Favorites';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="*"
              element={
                <>
                  <Navbar />
                  <Container component="main" sx={{ flexGrow: 1, py: 3 }}>
                    <Routes>
                      <Route path="/" element={<h1>Welcome to Waypoint</h1>} />
                      <Route path="/explore" element={<Explore />} />
                      <Route path="/trips" element={<Trips />} />
                      <Route path="/favorites" element={<Favorites />} />
                    </Routes>
                  </Container>
                </>
              }
            />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;
