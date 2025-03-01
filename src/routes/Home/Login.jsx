import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, TextField, Typography, Container, useTheme } from '@mui/material';
import { AppContext } from '../../Context/AppContext';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../shared/api';

const Login = () => {
  const theme = useTheme();
	const { dispatch } = useContext(AppContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

	useEffect(() => {
		const handleKeyDoqn = (e) => {
			if (e.key === 'Enter' && !isSubmitting) {
				e.preventDefault();
				handleSubmit();
			}
		};
		window.addEventListener('keydown', handleKeyDoqn);
		return () => window.removeEventListener('keydown', handleKeyDoqn);
	}, []);

  const handleSubmit = async (e) => {
    setError(null);
    setIsSubmitting(true);
    try {
      await loginUser({ username, password }, dispatch);
      navigate('/');
    } catch (err) {
      setError('Invalid username or password. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
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