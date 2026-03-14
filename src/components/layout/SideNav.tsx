import { List, ListItemButton, ListItemText, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'Resume Builder', path: '/home/resume-builder' },
];

export default function SideNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box
      sx={{
        width: 220,
        flexShrink: 0,
        height: '100%',
        pt: 1,
        bgcolor: '#000000',
      }}
    >
      <List disablePadding>
        {NAV_ITEMS.map((item) => (
          <ListItemButton
            key={item.path}
            selected={location.pathname === item.path}
            onClick={() => navigate(item.path)}
            sx={{
              color: '#ffffff',
              '&.Mui-selected': { bgcolor: '#222222' },
              '&:hover': { bgcolor: '#1a1a1a' },
            }}
          >
            <ListItemText primary={item.label} primaryTypographyProps={{ color: '#ffffff' }} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
