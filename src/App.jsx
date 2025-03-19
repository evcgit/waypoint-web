import { ThemeProvider } from '@mui/material/styles';
import { Box, Container } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { theme as baseTheme } from './shared/theme/theme';
import Navbar from './components/Navigation/Navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './routes/Home/Login';
import Explore from './routes/Dashboard/Explore';
import Trips from './routes/Dashboard/Trips';
import Favorites from './routes/Dashboard/Favorites';
import { useContext, useMemo, useEffect } from 'react';
import { AppContext } from './Context/AppContext';
import { createTheme } from '@mui/material/styles';
import SingleTripView from './routes/Dashboard/Trips/SingleTripView';

const App = () => {
	const { state, dispatch } = useContext(AppContext);

	const theme = useMemo(() => {
		const mode = state?.theme === '2' ? 'dark' : state?.theme === '1' ? 'light' : 'system';
		const isDark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

		return createTheme({
			...baseTheme,
			palette: {
				...baseTheme.palette,
				mode: isDark ? 'dark' : 'light',
				...(isDark && {
					background: baseTheme.palette.dark.background,
					text: baseTheme.palette.dark.text,
					divider: baseTheme.palette.dark.divider
				})
			}
		});
	}, [state?.theme]);

	useEffect(() => {
		if (state?.theme === '3') {
			const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
			const handleChange = () => {
				// Force theme recalculation
				dispatch({ type: 'SET_THEME', payload: '3' });
			};

			mediaQuery.addEventListener('change', handleChange);
			return () => mediaQuery.removeEventListener('change', handleChange);
		}
	}, [state?.theme]);

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
											<Route path="/trips/:tripId" element={<SingleTripView />} />
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
