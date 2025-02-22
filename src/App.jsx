import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Box, Container } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './shared/theme/theme';
import Navbar from './components/Navigation/Navbar';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <Container component="main" sx={{ flexGrow: 1, py: 3 }}>
          {/* Your main content will go here */}
          <h1>Welcome to Waypoint</h1>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default App;
