import { TextField, InputAdornment, IconButton, Box } from '@mui/material';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';

const IncrementSelect = ({ value, onChange, increment = 1, decrement = increment, label = 'Cost' }) => {

	const incrementCost = () => {
		onChange(Number(value || 0) + increment);
	};

	const decrementCost = () => {
		onChange(Math.max(0, Number(value || 0) - decrement));
	};

	return (
		<TextField
		fullWidth
		label={label}
		type="number"
		value={value}
		onChange={e => onChange(e.target.value)}
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
	);
};

export default IncrementSelect;
