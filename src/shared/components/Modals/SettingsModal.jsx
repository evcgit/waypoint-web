import { useContext, useState, useEffect } from 'react';
import Modal from '../../../components/Modal';
import {
	Box,
	Typography,
	Select,
	MenuItem,
	TextField,
	Stack,
	Button,
	Divider
} from '@mui/material';
import { AccountCircleOutlined, LogoutOutlined } from '@mui/icons-material';
import { logoutUser } from '../../../shared/api';
import { AppContext } from '../../../Context/AppContext';
import { getThemePreference, setThemePreference } from '../../../utils/helpers';

const SettingsModal = ({ open, onClose }) => {
	const { dispatch, state } = useContext(AppContext);
	const [formData, setFormData] = useState();
	const [themeMode, setThemeMode] = useState(getThemePreference());

	const initialState = {
		firstName: state?.user?.firstName || '',
		lastName: state?.user?.lastName || '',
		email: state?.user?.email || '',
		username: state?.user?.username || '',
		passportExpiry: state?.user?.passportExpiry || '',
		nationality: state?.user?.nationality || ''
	};

	useEffect(() => {
		setFormData(initialState);
	}, [state]);

	const handleLogout = () => {
		logoutUser(dispatch);
		onClose();
	};

	const handleThemeChange = (event) => {
		const newTheme = event.target.value;
		setThemeMode(newTheme);
		setThemePreference(newTheme);
		if (dispatch) {
			dispatch({ type: 'SET_THEME', payload: newTheme });
		}
	};

	const SubmitButton = () => {
		return (
			<Stack direction="row" spacing={2}>
				<Button variant="outlined" color="error" onClick={handleLogout}>
					<LogoutOutlined />
					Logout
				</Button>
				<Button variant="outlined" color="primary" onClick={handleLogout}>
					Submit
				</Button>
			</Stack>
		);
	};

	return (
		<Modal
			open={open}
			onModalClose={onClose}
			modalTitle="Settings"
			showCancelButton={false}
			useDialogActions={true}
			dialogActionButton={<SubmitButton />}
		>
			<Box
				sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}
			>
				<Stack direction="column" alignItems="center" spacing={2}>
					<AccountCircleOutlined sx={{ fontSize: '64px', mb: '16px' }} />
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '80%' }}>
						<TextField
							label="First Name"
							value={formData?.firstName}
							onChange={e => setFormData({ ...formData, firstName: e.target.value })}
						/>
						<TextField
							label="Last Name"
							value={formData?.lastName}
							onChange={e => setFormData({ ...formData, lastName: e.target.value })}
						/>
					</Box>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '80%' }}>
						<TextField
							sx={{ width: '80%' }}
							label="Email"
							value={formData?.email}
							onChange={e => setFormData({ ...formData, email: e.target.value })}
						/>
						<TextField
							label="Username"
							value={formData?.username}
							onChange={e => setFormData({ ...formData, username: e.target.value })}
						/>
					</Box>
				</Stack>
				<Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, width: '100%', mt: 2 }}>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 1,
							flex: 1
						}}
					>
						<Typography variant="caption">Personal Details</Typography>
						<TextField
							sx={{ width: '70%' }}
							label="Passport Expiry"
							value={formData?.passportExpiry}
							onChange={e => setFormData({ ...formData, passportExpiry: e.target.value })}
						/>
						<TextField
							sx={{ width: '70%' }}
							label="Nationality"
							value={formData?.nationality}
							onChange={e => setFormData({ ...formData, nationality: e.target.value })}
						/>
					</Box>
					<Divider orientation="vertical" flexItem />
					<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', flex: 1 }}>
						<Typography variant="caption">Preferences</Typography>
						<Select
							value={themeMode}
							onChange={handleThemeChange}
							sx={{ width: '70%' }}
						>
							<MenuItem value="1">Always Light</MenuItem>
							<MenuItem value="2">Always Dark</MenuItem>
							<MenuItem value="3">System Default</MenuItem>
						</Select>
					</Box>
				</Box>
			</Box>
		</Modal>
	);
};

export default SettingsModal;
