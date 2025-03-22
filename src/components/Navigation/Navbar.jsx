import { useState, useContext } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Avatar,
  Button,
  useTheme
} from '@mui/material';
import {
  ExploreOutlined,
  FlightTakeoffOutlined,
  FavoriteBorderOutlined,
  AccountCircleOutlined
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../Context/AppContext';
import SettingsModal from '../../shared/components/Modals/SettingsModal';

const Navbar = () => {
  const theme = useTheme();
  const { state } = useContext(AppContext);
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
      onClick: event => handleSettingsModalOpen(event)
    }
  ];

  const handleSettingsModalOpen = () => {
    setSettingsModalOpen(true);
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor:
          theme.palette.mode === 'dark'
            ? theme.palette.background.paper
            : theme.palette.background.default,
        borderBottom: `1px solid ${theme.palette.divider}`
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ display: { xs: 'none', md: 'flex' } }}>
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

          {/* Desktop Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            {pages.map(page =>
              !page.mobileOnly ? (
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
                        : theme.palette.text.secondary,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    '&:hover': {
                      color: theme.palette.primary.main,
                      backgroundColor: theme.palette.background.subtle
                    },
                    borderRadius: 1,
                    px: 2,
                    py: 1
                  }}
                >
                  {page.icon}
                  {page.name}
                </Button>
              ) : null
            )}
          </Box>

          {/* User Menu - Desktop Only */}
          {state.user ? (
            <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' } }}>
              <IconButton
                onClick={handleSettingsModalOpen}
                sx={{
                  p: 0,
                  '&:hover': {
                    backgroundColor: theme.palette.background.subtle
                  }
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      bgcolor: theme.palette.primary.dark
                    }
                  }}
                >
                  <AccountCircleOutlined />
                </Avatar>
              </IconButton>
            </Box>
          ) : (
            <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' } }}>
              <Button
                onClick={() => navigate('/login')}
                variant="outlined"
                color="primary"
                sx={{
                  '&:hover': {
                    backgroundColor: theme.palette.background.subtle
                  }
                }}
              >
                Login
              </Button>
            </Box>
          )}
        </Toolbar>

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
            bgcolor:
              theme.palette.mode === 'dark'
                ? theme.palette.background.paper
                : theme.palette.background.default,
            borderTop: `1px solid ${theme.palette.divider}`,
            zIndex: theme.zIndex.appBar
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
                      : theme.palette.text.secondary,
                  '&:hover': {
                    color: theme.palette.primary.main,
                    backgroundColor: theme.palette.background.subtle
                  }
                }}
              >
                {page.icon}
              </IconButton>
            </Box>
          ))}
        </Box>

        <SettingsModal
          open={settingsModalOpen}
          onClose={() => setSettingsModalOpen(false)}
        />
      </Container>
    </AppBar>
  );
};

export default Navbar;
