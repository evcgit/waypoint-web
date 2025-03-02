import { useState, useContext, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  useTheme,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import {
  FlightTakeoffOutlined,
  LockOutlined,
  PersonOutline,
  EmailOutlined
} from '@mui/icons-material';
import { AppContext } from '../../Context/AppContext';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../shared/api';

const Login = () => {
  const theme = useTheme();
  const { dispatch } = useContext(AppContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [page, setPage] = useState('login');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      if (page === 'register') {
        // TODO: register user and validations handling
        console.warn('new user');
      }
      await loginUser({ username, password }, dispatch);
      navigate('/');
    } catch (err) {
      setError('Invalid username or password. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleKeyPress = event => {
      if (event.key === 'Enter' && !isSubmitting) {
        event.preventDefault();
        handleSubmit();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isSubmitting, handleSubmit]);

  return (
    <>
      {isSubmitting ? (
        <Container
          maxWidth="sm"
          sx={{ mt: 8, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <CircularProgress />
        </Container>
      ) : (
        <Container
          maxWidth="sm"
          sx={{
            mt: 8,
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Typography
            variant="h4"
            noWrap
            sx={{
              width: 'fit-content',
              fontWeight: 700,
              color: theme.palette.primary.main,
              textDecoration: 'none',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/')}
          >
            <FlightTakeoffOutlined sx={{ mr: 1 }} />
            WAYPOINT
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 400 }}>
            Your personal travel assistant
          </Typography>
        </Container>
      )}
      {page === 'login' ? (
        <Container
          maxWidth="sm"
          sx={{
            mt: 8,
            border: '1px solid black',
            borderRadius: 2,
            p: 4,
            pt: 6,
            boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px'
          }}
        >
          {error && <Typography color="error">{error}</Typography>}
          <Box
            component="form"
            noValidate
            autoComplete="off"
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField
              label="Username"
              variant="outlined"
              disabled={isSubmitting}
              required
              fullWidth
              sx={{ bgcolor: theme.palette.background.default }}
              value={username}
              onChange={e => setUsername(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutline />
                  </InputAdornment>
                )
              }}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              disabled={isSubmitting}
              required
              fullWidth
              sx={{ bgcolor: theme.palette.background.default }}
              value={password}
              onChange={e => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined />
                  </InputAdornment>
                )
              }}
            />
            <Button
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              sx={{ mt: 2 }}
              onClick={e => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              Login
            </Button>
            <Button
              variant="outlined"
              onClick={() => setPage('register')}
              disabled={isSubmitting}
              width="70%"
            >
              Register
            </Button>
          </Box>
        </Container>
      ) : (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
          <Box
            component="form"
            noValidate
            autoComplete="off"
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField
              label="Username"
              variant="outlined"
              required
              fullWidth
              disabled={isSubmitting}
              sx={{ bgcolor: theme.palette.background.default }}
              value={username}
              onChange={e => setUsername(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutline />
                  </InputAdornment>
                )
              }}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              required
              fullWidth
              disabled={isSubmitting}
              sx={{ bgcolor: theme.palette.background.default }}
              value={password}
              onChange={e => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined />
                  </InputAdornment>
                )
              }}
            />
            <TextField
              label="Confirm Password"
              type="password"
              variant="outlined"
              required
              fullWidth
              disabled={isSubmitting}
              sx={{ bgcolor: theme.palette.background.default }}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined />
                  </InputAdornment>
                )
              }}
            />
            <TextField
              label="First Name"
              variant="outlined"
              required
              fullWidth
              disabled={isSubmitting}
              sx={{ bgcolor: theme.palette.background.default }}
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
            />
            <TextField
              label="Last Name"
              variant="outlined"
              required
              fullWidth
              disabled={isSubmitting}
              sx={{ bgcolor: theme.palette.background.default }}
              value={lastName}
              onChange={e => setLastName(e.target.value)}
            />
            <TextField
              label="Email"
              variant="outlined"
              required
              fullWidth
              disabled={isSubmitting}
              placeholder="example@email.com"
              sx={{ bgcolor: theme.palette.background.default }}
              value={email}
              onChange={e => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlined />
                  </InputAdornment>
                )
              }}
            />
            <Button
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              sx={{ mt: 2 }}
              onClick={handleSubmit}
            >
              Register
            </Button>
            <Button
              variant="outlined"
              onClick={() => setPage('login')}
              disabled={isSubmitting}
              width="70%"
            >
              Back to Login
            </Button>
          </Box>
        </Container>
      )}
    </>
  );
};

export default Login;
