import { useContext, useState, useEffect } from 'react';
import Modal from '../../../components/Modal';
import BasicSelect from '../../../components/Select';
import {
  Box,
  Typography,
  TextField,
  Stack,
  Button,
  Divider,
  Select,
  MenuItem
} from '@mui/material';
import { AccountCircleOutlined, LogoutOutlined } from '@mui/icons-material';
import { logoutUser, getCurrentUser, makeApiRequest } from '../../../shared/api';
import { AppContext } from '../../../Context/AppContext';
import { getThemePreference, setThemePreference } from '../../../utils/helpers';

const SettingsModal = ({ open, onClose }) => {
  const { dispatch, state } = useContext(AppContext);
  const [formData, setFormData] = useState();
  const [themeMode, setThemeMode] = useState(getThemePreference());
  const [countries, setCountries] = useState([]);

  const themeOptions = [
    { value: '1', label: 'Always Light' },
    { value: '2', label: 'Always Dark' },
    { value: '3', label: 'System Default' }
  ];

  const fetchCountries = async () => {
    try {
      const response = await makeApiRequest('GET', 'countries/');
      setCountries(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (open) {
      getCurrentUser(dispatch);
      fetchCountries();
    }
  }, [open, dispatch]);

  useEffect(() => {
    if (state?.user) {
      const nationality = countries.find(
        country => country.id === state.user.nationality
      );
      setFormData({
        firstName: state.user.firstName || '',
        lastName: state.user.lastName || '',
        email: state.user.email || '',
        username: state.user.username || '',
        passportExpiry: state.user.passportExpiry || '',
        nationality: nationality || ''
      });
    }
  }, [state?.user]);

  const handleLogout = () => {
    logoutUser(dispatch);
    onClose();
  };

  const handleThemeChange = event => {
    const newTheme = event.target.value;
    setThemeMode(newTheme);
    setThemePreference(newTheme);
    if (dispatch) {
      dispatch({ type: 'SET_THEME', payload: newTheme });
    }
  };

  const handleSubmit = async () => {
    const data = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      username: formData.username,
      passport_expiry: formData.passportExpiry,
      nationality: formData.nationality
    };
    try {
      await makeApiRequest('PUT', `users/${state.user.id}/`, data);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const SubmitButton = () => {
    return (
      <Stack direction="row" spacing={2}>
        <Button variant="outlined" color="error" onClick={handleLogout}>
          <LogoutOutlined />
          Logout
        </Button>
        <Button variant="outlined" color="primary" onClick={handleSubmit}>
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '80%' }}>
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
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 2,
            width: '100%',
            mt: 2
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              flex: 1
            }}
          >
            <Typography variant="caption">Passport Details</Typography>
            <TextField
              sx={{ width: '70%' }}
              label="Expiry Date"
              value={formData?.passportExpiry}
              onChange={e => setFormData({ ...formData, passportExpiry: e.target.value })}
              placeholder="MM/DD/YYYY"
            />
            <Select
              sx={{ width: '70%' }}
              value={formData?.nationality?.id || ''}
              renderValue={selected => {
                const selectedCountry = countries.find(
                  country => country.id === selected
                );
                return selectedCountry?.alpha2 || '';
              }}
              onChange={e => {
                const selectedCountry = countries.find(
                  country => country.id === e.target.value
                );
                setFormData({ ...formData, nationality: selectedCountry });
              }}
            >
              {countries.map(country => (
                <MenuItem key={country.id} value={country.id}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              flex: 1
            }}
          >
            <Typography variant="caption">Preferences</Typography>
            <BasicSelect
              options={themeOptions}
              value={themeMode}
              onChange={handleThemeChange}
              sx={{ width: '70%' }}
            />
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default SettingsModal;
