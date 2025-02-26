import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Box, Container } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './shared/theme/theme';
import Navbar from './components/Navigation/Navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './routes/Home/Login';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <Container component="main" sx={{ flexGrow: 1, py: 3 }}>
            <Routes>
              <Route path="/" element={<h1>Welcome to Waypoint</h1>} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;
