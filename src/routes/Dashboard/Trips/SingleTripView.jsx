import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import {
	AccessTime,
	AttachMoney,
	LocationOn,
	Hotel,
	DirectionsCar,
	Event,
	ArrowBack,
	Edit,
} from '@mui/icons-material';
import { makeApiRequest } from '../../../shared/api';
import { useTrip } from '../../../Context/TripContext';
import BasicSelect from '../../../components/Select';

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
		{ value: 'CANCELLED', label: 'Cancelled', color: 'error' },
	];

	useEffect(() => {
		const fetchTrip = async () => {
			if (!selectedTrip) return;
			try {
				const response = await makeApiRequest('GET', `/trips/${selectedTrip}/`);
				setTrip(response);
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

	const handleEdit = () => {
		navigate(`/trips/${selectedTrip}/edit`);
	};

	const getStatusDetails = (statusValue) => {
		return TRIP_STATUS.find((status) => status.value === statusValue) || TRIP_STATUS[0];
	};

	const handleStatusChange = (e) => {
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
		<Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: 'primary.light' }}>
			<Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
				<Stack direction="row" alignItems="center" gap={2}>
					<IconButton onClick={handleBack}>
						<ArrowBack />
					</IconButton>
					{editing ? (
						<TextField
							value={trip.title}
							onChange={(e) => setModifiedTrip({ ...trip, title: e.target.value })}
						/>
					) : (
						<Typography variant="h4">{trip.title}</Typography>
					)}
				</Stack>
				<IconButton>
					<Edit sx={{ fontSize: '1.2rem' }} />
				</IconButton>
			</Box>

			<Grid container spacing={2} sx={{ mt: 2 }}>
				<Grid item xs={12} sm={6} md={3}>
					<Box display="flex" alignItems="center" gap={1}>
						<AccessTime />
						<Typography>
							{format(new Date(trip.start_date), 'MMM d, yyyy')} -{' '}
							{format(new Date(trip.end_date), 'MMM d, yyyy')}
						</Typography>
					</Box>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<Box display="flex" alignItems="center" gap={1}>
						<AttachMoney />
						<Typography>
							Budget: {trip.currency} {trip.budget}
						</Typography>
					</Box>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
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
									padding: '4px 14px',
								}
							}}
						/>
					) : (
						<Chip
							label={getStatusDetails(trip.status).label}
							color={getStatusDetails(trip.status).color}
							onClick={() => setIsEditingStatus(true)}
							sx={{ cursor: 'pointer' }}
						/>
					)}
				</Grid>
				{trip.visa_required && (
					<Grid item xs={12} sm={6} md={3}>
						<Box display="flex" alignItems="center" gap={1}>
							<Typography>Visa Required</Typography>
						</Box>
					</Grid>
				)}
			</Grid>
		</Paper>
	);

	const DestinationsPanel = () => (
		<Grid container spacing={3}>
			{trip.all_destinations?.map((destination) => (
				<Grid item xs={12} md={6} key={destination.id}>
					<Card sx={{ p: 2 }}>
						<Box display="flex" alignItems="center" gap={1} mb={2}>
							<LocationOn />
							<Typography variant="h6">
								{destination.city}, {destination.country}
							</Typography>
						</Box>
						<Typography variant="body2" color="text.secondary" gutterBottom>
							{format(new Date(destination.arrival_date), 'MMM d')} -{' '}
							{format(new Date(destination.departure_date), 'MMM d, yyyy')}
						</Typography>
						{destination.notes && (
							<Typography variant="body2">{destination.notes}</Typography>
						)}
					</Card>
				</Grid>
			))}
		</Grid>
	);

	const AccommodationsPanel = () => (
		<Grid container spacing={3}>
			{trip.all_accommodations?.map((accommodation) => (
				<Grid item xs={12} md={6} key={accommodation.id}>
					<Card sx={{ p: 2 }}>
						<Box display="flex" alignItems="center" gap={1} mb={2}>
							<Hotel />
							<Typography variant="h6">{accommodation.name}</Typography>
						</Box>
						<Typography variant="body2" color="text.secondary" gutterBottom>
							{format(new Date(accommodation.checkin_date), 'MMM d, HH:mm')} -{' '}
							{format(new Date(accommodation.checkout_date), 'MMM d, HH:mm')}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Cost: {trip.currency} {accommodation.cost}
						</Typography>
					</Card>
				</Grid>
			))}
		</Grid>
	);

	const ActivitiesPanel = () => (
		<Grid container spacing={3}>
			{trip.all_activities?.map((activity) => (
				<Grid item xs={12} md={6} key={activity.id}>
					<Card sx={{ p: 2 }}>
						<Box display="flex" alignItems="center" gap={1} mb={2}>
							<Event />
							<Typography variant="h6">{activity.name}</Typography>
						</Box>
						<Typography variant="body2" color="text.secondary" gutterBottom>
							{format(new Date(activity.start_time), 'MMM d, HH:mm')} -{' '}
							{format(new Date(activity.end_time), 'HH:mm')}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Cost: {trip.currency} {activity.cost}
						</Typography>
					</Card>
				</Grid>
			))}
		</Grid>
	);

	const TransportPanel = () => (
		<Grid container spacing={3}>
			{trip.all_transport?.map((transport) => (
				<Grid item xs={12} key={transport.id}>
					<Card sx={{ p: 2 }}>
						<Box display="flex" alignItems="center" gap={1} mb={2}>
							<DirectionsCar />
							<Typography variant="h6">{transport.name}</Typography>
						</Box>
						<Typography variant="body2" color="text.secondary" gutterBottom>
							{format(new Date(transport.start_time), 'MMM d, HH:mm')} -{' '}
							{format(new Date(transport.end_time), 'MMM d, HH:mm')}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							From: {transport.from_destination.city} → To:{' '}
							{transport.to_destination.city}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Cost: {trip.currency} {transport.cost}
						</Typography>
					</Card>
				</Grid>
			))}
		</Grid>
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
				<DestinationsPanel />
			</TabPanel>
			<TabPanel value={activeTab} index={1}>
				<AccommodationsPanel />
			</TabPanel>
			<TabPanel value={activeTab} index={2}>
				<ActivitiesPanel />
			</TabPanel>
			<TabPanel value={activeTab} index={3}>
				<TransportPanel />
			</TabPanel>
		</Box>
	);
};

export default SingleTripView;
