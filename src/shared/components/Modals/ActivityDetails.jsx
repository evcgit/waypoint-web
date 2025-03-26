import { useEffect, useState } from 'react';
import {
	Box,
	TextField,
	Button,
	Stack,
	FormControl
} from '@mui/material';
import Modal from '../../../components/Modal';
import DateRangeSelector from '../DateRangeSelector';
import IncrementSelect from '../../../components/IncrementSelect';

const ActivityDetails = ({ open, onClose, activity }) => {
	const [startDate, setStartDate] = useState(
		activity ? new Date(activity.start_time) : null
	);
	const [endDate, setEndDate] = useState(
		activity ? new Date(activity.end_time) : null
	);

	const [formData, setFormData] = useState({
		name: '',
		start_time: null,
		end_time: null,
		cost: 0,
		notes: ''
	});

	useEffect(() => {
		if (activity) {
			setFormData({
				name: activity.name,
				start_time: new Date(activity.start_time),
				end_time: new Date(activity.end_time),
				cost: activity.cost,
				notes: activity.notes || ''
			});
			setStartDate(new Date(activity.start_time));
			setEndDate(new Date(activity.end_time));
		} else {
			setFormData({
				name: '',
				start_time: null,
				end_time: null,
				cost: 0,
				notes: ''
			});
			setStartDate(null);
			setEndDate(null);
		}
	}, [activity]);

	useEffect(() => {
		setFormData(prev => ({
			...prev,
			start_time: startDate,
			end_time: endDate
		}));
	}, [startDate, endDate]);

	const handleSubmit = async e => {
		try {
			console.warn(formData);
			onClose();
		} catch (error) {
			console.error('Error saving activity:', error);
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
			modalTitle={activity ? `Edit ${formData.name}` : 'Add Activity'}
			useDialogActions
			dialogActionButton={
				<Box display="flex" gap={2} justifyContent="flex-end">
					<Button variant="contained" onClick={handleSubmit}>
						{activity ? 'Save' : 'Create'}
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

export default ActivityDetails;
