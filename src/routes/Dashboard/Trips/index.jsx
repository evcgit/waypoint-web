import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  Stack,
  Chip,
  IconButton,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import { format } from 'date-fns';
import {
  AccessTime,
  AttachMoney,
  ChevronRight,
  LocationOn,
  Add as AddIcon
} from '@mui/icons-material';
import { makeApiRequest } from '../../../shared/api';
import { useTrip } from '../../../Context/TripContext';

const Trips = () => {
  const navigate = useNavigate();
  const { setSelectedTrip } = useTrip();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await makeApiRequest('GET', 'trips/');
        setTrips(response);
        setError(null);
      } catch (err) {
        setError('Failed to load trips. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const tripsByYear = useMemo(() => {
    const grouped = {};
    trips?.forEach(trip => {
      const year = new Date(trip.start_date).getFullYear();
      if (!grouped[year]) {
        grouped[year] = [];
      }
      grouped[year].push(trip);
    });
    return Object.entries(grouped)
      .sort(([yearA], [yearB]) => yearB - yearA)
      .map(([year, yearTrips]) => ({
        year,
        trips: yearTrips.sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
      }));
  }, [trips]);

  const handleTripClick = trip => {
    setSelectedTrip(trip.id);
    navigate(`/trips/details/`);
  };

  const handleCreateTrip = () => {
    navigate('/trips/create');
  };

  const TripCard = ({ trip }) => (
    <Card
      onClick={() => handleTripClick(trip)}
      sx={{
        width: 300,
        p: 2,
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 4
        }
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Typography variant="h6" gutterBottom noWrap>
          {trip.title}
        </Typography>
        <Chip
          size="small"
          label={trip.status}
          color={trip.status === 'PLANNING' ? 'warning' : 'success'}
        />
      </Box>

      <Stack spacing={1.5} mt={2}>
        <Box display="flex" alignItems="center" gap={1}>
          <AccessTime sx={{ fontSize: 20 }} />
          <Typography variant="body2" color="text.secondary">
            {format(new Date(trip.start_date), 'MMM d')} -{' '}
            {format(new Date(trip.end_date), 'MMM d, yyyy')}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <AttachMoney sx={{ fontSize: 20 }} />
          <Typography variant="body2" color="text.secondary">
            {trip.currency} {trip.budget}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <LocationOn sx={{ fontSize: 20 }} />
          <Typography variant="body2" color="text.secondary" noWrap>
            {trip.all_destinations?.length} destinations
          </Typography>
        </Box>
      </Stack>

      <Box display="flex" justifyContent="flex-end" mt={2}>
        <IconButton size="small">
          <ChevronRight />
        </IconButton>
      </Box>
    </Card>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">My Trips</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateTrip}>
          Create Trip
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!error && trips.length === 0 ? (
        <Box display="flex" flexDirection="column" alignItems="center" gap={2} py={8}>
          <Typography variant="h6" color="text.secondary">
            You haven&apos;t created any trips yet
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateTrip}>
            Create Your First Trip
          </Button>
        </Box>
      ) : (
        <Stack spacing={4}>
          {tripsByYear.map(({ year, trips }) => (
            <Box key={year}>
              <Typography variant="h5" gutterBottom>
                {year}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  overflowX: 'auto',
                  pb: 2,
                  px: 2,
                  '::-webkit-scrollbar': {
                    height: 8
                  },
                  '::-webkit-scrollbar-track': {
                    backgroundColor: 'grey.100',
                    borderRadius: 4
                  },
                  '::-webkit-scrollbar-thumb': {
                    backgroundColor: 'grey.400',
                    borderRadius: 4,
                    '&:hover': {
                      backgroundColor: 'grey.500'
                    }
                  }
                }}
              >
                {trips.map(trip => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </Box>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default Trips;
