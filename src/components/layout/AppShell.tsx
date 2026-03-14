import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import { useStore } from 'react-redux';
import type { RootState } from '../../store';
import { useLogoutMutation } from '../../store/apiSlice';
import { createLandingBindings } from '../../pages/landingBindings';
import SideNav from './SideNav';

export default function AppShell() {
  const navigate = useNavigate();
  const store = useStore<RootState>();
  const [logoutMutation] = useLogoutMutation();

  const { currentUser, handleLogout } = createLandingBindings({
    getState: () => store.getState(),
    logout: () => logoutMutation().unwrap(),
    navigate,
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar position="static" elevation={0} sx={{ bgcolor: '#000000' }}>
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, fontWeight: 'bold', color: '#ffffff' }}
          >
            onemployment
          </Typography>
          {currentUser && (
            <Typography variant="body2" sx={{ mr: 2, color: '#ffffff' }}>
              Welcome {currentUser.username}
            </Typography>
          )}
          <Button onClick={handleLogout} sx={{ color: '#ffffff' }}>
            Log out
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        <SideNav />
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, overflow: 'auto', bgcolor: '#ffffff' }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
