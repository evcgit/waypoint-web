import { Grid, Card, Box, Typography } from '@mui/material';
import { Hotel, Add } from '@mui/icons-material';
import { format } from 'date-fns';

const AccommodationsPanel = ({ accommodations, currency }) => (
	<Grid container spacing={3}>
		{[...(accommodations || []), 'add_new'].map(accommodation => (
			<Grid item xs={12} md={6} key={accommodation === 'add_new' ? 'add_new' : accommodation.id}>
				{accommodation === 'add_new' ? (
					<Card sx={{ p: 2, border: '1px dashed #ccc', cursor: 'pointer', backgroundColor: 'transparent' }}>
						<Box display="flex" alignItems="center" justifyContent="center" gap={1}>
							<Add />
							Add Accommodation
						</Box>
					</Card>
				) : (
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
							Cost: {currency} {accommodation.cost}
						</Typography>
					</Card>
				)}
			</Grid>
		))}
	</Grid>
);

export default AccommodationsPanel;