import { useEffect, useState } from 'react';
import {
	Box,
	TextField,
	Button,
	Stack,
	FormControl,
} from '@mui/material';
import Modal from '../../../components/Modal';
import DateRangeSelector from '../DateRangeSelector';
import IncrementSelect from '../../../components/IncrementSelect';

const TransportDetails = ({ open, onClose, trip, transport }) => {
	const [startDate, setStartDate] = useState(
		transport ? new Date(transport.start_time) : null
	);
	const [endDate, setEndDate] = useState(
		transport ? new Date(transport.end_time) : null
	);

	const [formData, setFormData] = useState({
		name: '',
		start_time: null,
		end_time: null,
		from_destination: '',
		to_destination: '',
		cost: 0,
		notes: ''
	});

	useEffect(() => {
		if (transport) {
			setFormData({
				name: transport.name,
				start_time: new Date(transport.start_time),
				end_time: new Date(transport.end_time),
				from_destination: trip.destinations.find(d => d.id === transport.from_destination).city,
				to_destination: trip.destinations.find(d => d.id === transport.to_destination).city,
				cost: transport.cost,
				notes: transport.notes || ''
			});
			setStartDate(new Date(transport.start_time));
			setEndDate(new Date(transport.end_time));
		} else {
			setFormData({
				name: '',
				start_time: null,
				end_time: null,
				from_destination: '',
				to_destination: '',
				cost: 0,
				notes: ''
			});
			setStartDate(null);
			setEndDate(null);
		}
	}, [transport]);

	useEffect(() => {
		setFormData(prev => ({
			...prev,
			start_time: startDate,
			end_time: endDate
		}));
	}, [startDate, endDate]);

	const handleSubmit = async e => {
		e.preventDefault();
		try {
			console.log(formData);
			onClose();
		} catch (error) {
			console.error('Error saving transport:', error);
		}
	};

	const handleCostChange = value => {
		const newValue = parseFloat(value);
		if (!isNaN(newValue)) {
			setFormData({ ...formData, cost: newValue });
		}
	};

	return (
		<Modal
			open={open}
			onModalClose={onClose}
			modalTitle={transport ? `Edit ${formData.name}` : 'Add Transportation'}
			useDialogActions
			dialogActionButton={
				<Box display="flex" gap={2} justifyContent="flex-end">
					<Button variant="contained" onClick={handleSubmit}>
						{transport ? 'Save' : 'Create'}
					</Button>
				</Box>
			}
		>
			<Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
				<Stack spacing={3}>
					<TextField
						fullWidth
						label="Name"
						value={formData.name}
						onChange={e => setFormData({ ...formData, name: e.target.value })}
						required
					/>
					<TextField
						fullWidth
						label="From Destination"
						value={formData.from_destination}
						onChange={e => setFormData({ ...formData, from_destination: e.target.value })}
						required
					/>
					<TextField
						fullWidth
						label="To Destination"
						value={formData.to_destination}
						onChange={e => setFormData({ ...formData, to_destination: e.target.value })}
						required
					/>
					<FormControl fullWidth>
						<DateRangeSelector
							startDate={startDate}
							endDate={endDate}
							setStartDate={newValue => setStartDate(newValue)}
							setEndDate={newValue => setEndDate(newValue)}
							overrideSx={{
								borderRadius: '4px',
								border: '1px solid rgba(0, 0, 0, 0.23)',
								'&:hover': {
									borderColor: 'rgba(0, 0, 0, 0.87)'
								},
								'& fieldset': {
									border: 'none'
								},
								borderColor: '#2d3748'
							}}
						/>
					</FormControl>

					<IncrementSelect
						value={formData.cost}
						onChange={handleCostChange}
					/>

					<TextField
						fullWidth
						label="Notes"
						multiline
						rows={4}
						value={formData.notes}
						onChange={e => setFormData({ ...formData, notes: e.target.value })}
					/>
				</Stack>
			</Box>
		</Modal>
	);
};

export default TransportDetails;
