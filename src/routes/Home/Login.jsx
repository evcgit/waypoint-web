import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../shared/api';

const Login = () => {
  const theme = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const data = { username, password };
      const loginResponse = await loginUser(data);

      if (loginResponse) {
        navigate('/');
      }
    } catch (err) {
      setError('Invalid username or password. Please try again.');
      console.error(err);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Typography variant="h4" align="center" sx={{ mb: 4, fontWeight: 700, color: theme.palette.primary.main }}>
        Login
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Username"
          variant="outlined"
          required
          fullWidth
          sx={{ bgcolor: theme.palette.background.default }}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          required
          fullWidth
          sx={{ bgcolor: theme.palette.background.default }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSubmit}>
          Login
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
