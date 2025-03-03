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
  SettingsOutlined
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../Context/AppContext';
import SettingsModal from '../../shared/components/Modals/SettingsModal';

const Navbar = () => {
  const theme = useTheme();
  const { state, dispatch } = useContext(AppContext);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);
  const navigate = useNavigate();

  const pages = [
    { name: 'Explore', icon: <ExploreOutlined />, path: '/explore' },
    { name: 'Trips', icon: <FlightTakeoffOutlined />, path: '/trips' },
    { name: 'Favorites', icon: <FavoriteBorderOutlined />, path: '/favorites' },
    {
      name: 'Profile',
      icon: <AccountCircleOutlined />,
      path: '#',
      mobileOnly: true,
      onClick: event => handleOpenUserMenu(event)
    }
  ];

  const handleOpenUserMenu = event => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleSettingsModalOpen = () => {
    setSettingsModalOpen(true);
    handleCloseUserMenu();
  };

  const handleSettingsModalClose = () => {
    setSettingsModalOpen(false);
  };

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
              pb: 1,
              pt: 1,
              bottom: 0,
              left: 0,
              right: 0,
              bgcolor: theme.palette.background.default,
              boxShadow: 2
            }}
          >
            {pages.map(page => (
              <Box
                key={page.name}
                sx={{
                  display: page.mobileOnly ? { xs: 'block', md: 'none' } : 'block',
                  borderBottom:
                    selectedPage === page.name
                      ? `2px solid ${theme.palette.primary.main}`
                      : 'none'
                }}
              >
                <IconButton
                  onClick={event => {
                    if (page.onClick) {
                      page.onClick(event);
                    } else {
                      navigate(page.path);
                      setSelectedPage(page.name);
                    }
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
              </Box>
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

          {/* User Menu - Desktop Only */}
          {state.user ? (
            <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' } }}>
              <IconButton onClick={handleSettingsModalOpen} sx={{ p: 0 }}>
                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                  <AccountCircleOutlined />
                </Avatar>
              </IconButton>
            </Box>
          ) : (
            <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' } }}>
              <Button onClick={() => navigate('/login')}>Login</Button>
            </Box>
          )}
        </Toolbar>
        <SettingsModal
          open={settingsModalOpen}
          onClose={() => setSettingsModalOpen(false)}
        />
      </Container>
    </AppBar>
  );
};

export default Navbar;
