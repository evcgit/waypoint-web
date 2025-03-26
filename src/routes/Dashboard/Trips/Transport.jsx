import { useState } from 'react';
import { Grid, Card, Box, Typography } from '@mui/material';
import { DirectionsCar, Add } from '@mui/icons-material';
import { format } from 'date-fns';
import TransportDetails from '../../../shared/components/Modals/TransportDetails';

const TransportPanel = ({ trip }) => {
	const [open, setOpen] = useState(false);
	const [selectedTransport, setSelectedTransport] = useState(null);

	const handleOpen = (transport) => {
		setSelectedTransport(transport);
		setOpen(true);
	};

	const handleClose = () => {
		setSelectedTransport(null);
		setOpen(false);
	};

	return (
		<>
			<Grid container spacing={3}>
				{[...(trip.transports || []), 'add_new'].map(transport => (
					<Grid item xs={12} key={transport === 'add_new' ? 'add_new' : transport.id}>
						{transport === 'add_new' ? (
							<Card
								sx={{
									p: 2,
									border: '1px dashed #ccc',
									cursor: 'pointer',
									backgroundColor: 'transparent'
								}}
							>
								<Box display="flex" alignItems="center" justifyContent="center" gap={1}>
									<Add />
									Add Transport
								</Box>
							</Card>
						) : (
							<Card sx={{ p: 2, cursor: 'pointer' }} onClick={() => handleOpen(transport)}>
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
						)}
					</Grid>
				))}
			</Grid>
			<TransportDetails
				open={open}
				onClose={handleClose}
				trip={trip}
				transport={selectedTransport}
			/>
		</>
	);
}

export default TransportPanel;
