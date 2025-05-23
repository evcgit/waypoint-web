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

const AccommodationDetails = ({ open, onClose, accommodation }) => {
	const [startDate, setStartDate] = useState(
		accommodation ? new Date(accommodation.checkin_date) : null
	);
	const [endDate, setEndDate] = useState(
		accommodation ? new Date(accommodation.checkout_date) : null
	);

	const [formData, setFormData] = useState({
		name: '',
		checkin_date: null,
		checkout_date: null,
		cost: 0,
		notes: ''
	});

	useEffect(() => {
		if (accommodation) {
			setFormData({
				name: accommodation.name,
				checkin_date: new Date(accommodation.checkin_date),
				checkout_date: new Date(accommodation.checkout_date),
				cost: accommodation.cost,
				notes: accommodation.notes || ''
			});
			setStartDate(new Date(accommodation.checkin_date));
			setEndDate(new Date(accommodation.checkout_date));
		} else {
			setFormData({
				name: '',
				checkin_date: null,
				checkout_date: null,
				cost: 0,
				notes: ''
			});
			setStartDate(null);
			setEndDate(null);
		}
	}, [accommodation]);

	useEffect(() => {
		setFormData(prev => ({
			...prev,
			checkin_date: startDate,
			checkout_date: endDate
		}));
	}, [startDate, endDate]);

	const handleSubmit = async e => {
		e.preventDefault();

		try {
			console.log(formData);
			onClose();
		} catch (error) {
			console.error('Error saving accommodation:', error);
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
			modalTitle={accommodation ? `Edit ${formData.name}` : 'Add Accommodation'}
			useDialogActions
			dialogActionButton={
				<Box display="flex" gap={2} justifyContent="flex-end">
					<Button variant="contained" onClick={handleSubmit}>
						{accommodation ? 'Save' : 'Create'}
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

export default AccommodationDetails;
