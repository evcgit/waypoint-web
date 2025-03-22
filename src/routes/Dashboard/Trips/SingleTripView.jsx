import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  Card,
  Grid,
  Typography,
  Tabs,
  Tab,
  Box,
  Chip,
  IconButton,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Stack,
  TextField
} from '@mui/material';
import {
  AccessTime,
  AttachMoney,
  LocationOn,
  Hotel,
  DirectionsCar,
  Event,
  ArrowBack,
  Edit
} from '@mui/icons-material';
import { makeApiRequest } from '../../../shared/api';
import { useTrip } from '../../../Context/TripContext';
import BasicSelect from '../../../components/Select';
import DestinationsPanel from './Destinations';
import AccommodationsPanel from './Accommodations';
import ActivitiesPanel from './Activities';
import TransportPanel from './Transport';

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index} role="tabpanel">
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const SingleTripView = () => {
  const { selectedTrip } = useTrip();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [editing, setEditing] = useState(false);
  const [modifiedTrip, setModifiedTrip] = useState(null);
  const [isEditingStatus, setIsEditingStatus] = useState(false);

  const TRIP_STATUS = [
    { value: 'PLANNING', label: 'Planning', color: 'warning' },
    { value: 'IN_PROGRESS', label: 'In Progress', color: 'success' },
    { value: 'COMPLETED', label: 'Completed', color: 'success' },
    { value: 'CANCELLED', label: 'Cancelled', color: 'error' }
  ];

  useEffect(() => {
    const fetchTrip = async () => {
      if (!selectedTrip) return;
      try {
        const response = await makeApiRequest('GET', `/trips/${selectedTrip}/`);
				console.log(response);
        setTrip(response);
        setModifiedTrip(response);
        setError(null);
      } catch (err) {
        setError('Failed to load trip details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [selectedTrip]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleBack = () => {
    navigate('/trips');
  };

  const handleQuickEdit = (field, value) => {
    setModifiedTrip({ ...trip, [field]: value });
  };

  const getStatusDetails = statusValue => {
    return TRIP_STATUS.find(status => status.value === statusValue) || TRIP_STATUS[0];
  };

  const handleStatusChange = e => {
    setTrip({ ...trip, status: e.target.value });
    setIsEditingStatus(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button startIcon={<ArrowBack />} onClick={handleBack}>
          Back to Trips
        </Button>
      </Box>
    );
  }

  if (!trip) {
    return (
      <Box p={3}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Trip not found
        </Alert>
        <Button startIcon={<ArrowBack />} onClick={handleBack}>
          Back to Trips
        </Button>
      </Box>
    );
  }

  const TripHeader = () => (
    <Paper elevation={0} sx={{ px: 3, pt: 3, pb: 1, mb: 3 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Stack direction="row" alignItems="center" gap={2}>
          <IconButton onClick={handleBack}>
            <ArrowBack />
          </IconButton>
          {editing ? (
            <TextField
              value={modifiedTrip?.title || trip.title}
              onChange={e => handleQuickEdit('title', e.target.value)}
              autoFocus
              sx={{
                '& .MuiInputBase-root': {
                  p: 0,
                  fontSize: 'h4.fontSize',
                  fontWeight: 'h4.fontWeight',
                  fontFamily: 'h4.fontFamily'
                },
                '& .MuiInput-input': {
                  p: 0,
                  lineHeight: 1.235
                }
              }}
              variant="standard"
            />
          ) : (
            <Typography variant="h4">{modifiedTrip?.title}</Typography>
          )}
          {isEditingStatus ? (
            <BasicSelect
              options={TRIP_STATUS}
              value={trip.status}
              onChange={handleStatusChange}
              autoFocus
              onBlur={() => setIsEditingStatus(false)}
              overrideSx={{
                minWidth: '120px',
                height: '32px',
                '& .MuiSelect-select': {
                  padding: '4px 14px'
                }
              }}
            />
          ) : (
            <Chip
              label={getStatusDetails(trip.status).label}
              color={getStatusDetails(trip.status).color}
              onClick={() => setIsEditingStatus(true)}
              sx={{ cursor: 'pointer', p: 0 }}
            />
          )}
					{trip.visa_required && (
						<Chip label='Visa Required' color='error' />
					)}
        </Stack>
				<Stack direction="row" alignItems="center" gap={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <AccessTime />
            <Typography>
              {format(new Date(trip.start_date), 'MMM d')} -{' '}
              {format(new Date(trip.end_date), 'MMM d, yyyy')}
            </Typography>
          </Box>
        <IconButton onClick={() => setEditing(!editing)}>
          <Edit sx={{ fontSize: '1.2rem' }} />
        </IconButton>
				</Stack>
      </Box>
    </Paper>
  );

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 3 }}>
      <TripHeader />

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Destinations" />
        <Tab label="Accommodations" />
        <Tab label="Activities" />
        <Tab label="Transport" />
      </Tabs>

      <TabPanel value={activeTab} index={0}>
        <DestinationsPanel destinations={trip.destinations} />
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        <AccommodationsPanel accommodations={trip.accommodations} currency={trip.currency} />
      </TabPanel>
      <TabPanel value={activeTab} index={2}>
        <ActivitiesPanel activities={trip.activities} currency={trip.currency} />
      </TabPanel>
      <TabPanel value={activeTab} index={3}>
        <TransportPanel transports={trip.transports} currency={trip.currency} />
      </TabPanel>
    </Box>
  );
};

export default SingleTripView;
