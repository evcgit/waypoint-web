import { useEffect, useState } from 'react';
import {
	Box,
	TextField,
	Button,
	Stack,
	FormControl,
	IconButton,
	InputAdornment
} from '@mui/material';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import Modal from '../../../components/Modal';
import DateRangeSelector from '../DateRangeSelector';

const AccommodationDetails = ({ open, onClose, accommodation, destinationId }) => {
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

		const payload = {
			...formData,
			destination: destinationId
		};

		try {
			if (accommodation) {
				await updateAccommodation(accommodation.id, payload);
			} else {
				await createAccommodation(payload);
			}
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

	const incrementCost = () => {
		setFormData(prev => ({
			...prev,
			cost: Number(prev.cost || 0) + 1
		}));
	};

	const decrementCost = () => {
		setFormData(prev => ({
			...prev,
			cost: Math.max(0, Number(prev.cost || 0) - 1)
		}));
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

					<TextField
						fullWidth
						label="Cost"
						type="number"
						value={formData.cost}
						onChange={e => handleCostChange(e.target.value)}
						InputProps={{
							inputProps: {
								min: 0,
								step: 0.01,
								style: {
									textAlign: 'left',
									paddingRight: '8px'
								}
							},
							endAdornment: (
								<InputAdornment position="end">
									<Box sx={{ display: 'flex', flexDirection: 'column' }}>
										<IconButton
											size="small"
											onClick={incrementCost}
											sx={{
												padding: '2px',
												'&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
											}}
										>
											<KeyboardArrowUp fontSize="small" />
										</IconButton>
										<IconButton
											size="small"
											onClick={decrementCost}
											sx={{
												padding: '2px',
												'&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
											}}
										>
											<KeyboardArrowDown fontSize="small" />
										</IconButton>
									</Box>
								</InputAdornment>
							),
							sx: {
								'& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button':
								{
									display: 'none'
								},
								'& input[type=number]': {
									MozAppearance: 'textfield'
								}
							}
						}}
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
