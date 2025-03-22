import { Grid, Card, Box, Typography } from '@mui/material';
import { LocationOn, Add } from '@mui/icons-material';
import { format } from 'date-fns';

const DestinationsPanel = ({ destinations }) => (
	<Grid container spacing={3}>
		{[...(destinations || []), 'add_new'].map(destination => (
			<Grid item xs={12} md={6} key={destination === 'add_new' ? 'add_new' : destination.id}>
				{destination === 'add_new' ? (
					<Card sx={{ p: 2, border: '1px dashed #ccc', cursor: 'pointer', backgroundColor: 'transparent' }}>
						<Box display="flex" alignItems="center" justifyContent="center" gap={1}>
							<Add />
							Add Destination
						</Box>
					</Card>
				) : (
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
				)}
			</Grid>
		))}
	</Grid>
);

export default DestinationsPanel;