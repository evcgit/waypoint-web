import { useState, useContext } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  useTheme
} from '@mui/material';
import {
  ExploreOutlined,
  FlightTakeoffOutlined,
  FavoriteBorderOutlined,
  AccountCircleOutlined,
  SettingsOutlined,
  LogoutOutlined
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../Context/AppContext';
import { logoutUser } from '../../shared/api';

const Navbar = () => {
  const theme = useTheme();
  const { state, dispatch } = useContext(AppContext);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);
  const navigate = useNavigate();
  const handleOpenUserMenu = event => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const pages = [
    { name: 'Explore', icon: <ExploreOutlined />, path: '/explore' },
    { name: 'Trips', icon: <FlightTakeoffOutlined />, path: '/trips' },
    { name: 'Favorites', icon: <FavoriteBorderOutlined />, path: '/favorites' }
  ];

  const settings = [
    {
      name: 'Settings',
      icon: <SettingsOutlined />,
      function: () => setSettingsModalOpen(true)
    },
    { name: 'Logout', icon: <LogoutOutlined />, function: () => logoutUser(dispatch) }
  ];

  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo - Desktop */}
          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: theme.palette.primary.main,
              textDecoration: 'none',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/')}
          >
            WAYPOINT
          </Typography>

          {/* Mobile Menu */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: 'flex', md: 'none' },
              justifyContent: 'space-around',
              position: 'fixed',
              py: 2,
              bottom: 0,
              left: 0,
              right: 0,
              bgcolor: theme.palette.background.default,
              boxShadow: 2
            }}
          >
            {pages.map(page => (
              <IconButton
                key={page.name}
                onClick={() => {
                  navigate(page.path);
                  setSelectedPage(page.name);
                }}
                sx={{
                  color:
                    selectedPage === page.name
                      ? theme.palette.primary.main
                      : theme.palette.text.primary
                }}
              >
                {page.icon}
              </IconButton>
            ))}
          </Box>

          {/* Logo - Mobile */}
          <Typography
            variant="h5"
            noWrap
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 700,
              color: theme.palette.primary.main,
              textDecoration: 'none'
            }}
            onClick={() => navigate('/')}
          >
            WAYPOINT
          </Typography>

          {/* Desktop Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            {pages.map(page => (
              <Button
                key={page.name}
                onClick={() => {
                  navigate(page.path);
                  setSelectedPage(page.name);
                }}
                sx={{
                  color:
                    selectedPage === page.name
                      ? theme.palette.primary.main
                      : theme.palette.text.primary,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  '&:hover': {
                    color: theme.palette.primary.main,
                    backgroundColor: theme.palette.background.subtle
                  }
                }}
              >
                {page.icon}
                {page.name}
              </Button>
            ))}
          </Box>

          {/* User Menu */}
          {state.user ? (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                    <AccountCircleOutlined />
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px', display: 'flex', justifyContent: 'space-between' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map(setting => (
                  <MenuItem key={setting.name} onClick={setting.function}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {setting.icon}
                      <Typography textAlign="center">{setting.name}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          ) : (
            <Box sx={{ flexGrow: 0 }}>
              <Button onClick={() => navigate('/login')}>Login</Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
