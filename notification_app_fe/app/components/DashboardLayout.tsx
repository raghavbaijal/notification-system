'use client';
import React, { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Divider, Avatar, IconButton, AppBar, Toolbar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ViewListIcon from '@mui/icons-material/ViewList';
import StarIcon from '@mui/icons-material/Star';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const drawerWidth = 240;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#f9fafb' }}>
      <Box sx={{ p: 3, pb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', fontSize: 16 }}>
          NotifyHub
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: 12 }}>
          Campus Eval
        </Typography>
      </Box>
      <Divider />
      
      <Box sx={{ p: 2, flexGrow: 1 }}>
        <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', ml: 1, mb: 1, display: 'block' }}>
          Main
        </Typography>
        <List disablePadding>
          <Link href="/" passHref style={{ textDecoration: 'none', color: 'inherit' }}>
            <ListItem 
              component="div"
              onClick={() => setMobileOpen(false)}
              sx={{ 
                borderRadius: 1.5, 
                mb: 0.5,
                backgroundColor: pathname === '/' ? 'rgba(0,0,0,0.04)' : 'transparent',
                cursor: 'pointer',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: pathname === '/' ? 'primary.main' : 'text.secondary' }}>
                <ViewListIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary={
                  <Typography sx={{ fontSize: 14, fontWeight: pathname === '/' ? 600 : 400, color: pathname === '/' ? 'text.primary' : 'text.secondary' }}>
                    All Notifications
                  </Typography>
                } 
              />
            </ListItem>
          </Link>

          <Link href="/priority" passHref style={{ textDecoration: 'none', color: 'inherit' }}>
            <ListItem 
              component="div"
              onClick={() => setMobileOpen(false)}
              sx={{ 
                borderRadius: 1.5, 
                mb: 0.5,
                backgroundColor: pathname === '/priority' ? 'rgba(0,0,0,0.04)' : 'transparent',
                cursor: 'pointer',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: pathname === '/priority' ? 'warning.main' : 'text.secondary' }}>
                <StarIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary={
                  <Typography sx={{ fontSize: 14, fontWeight: pathname === '/priority' ? 600 : 400, color: pathname === '/priority' ? 'text.primary' : 'text.secondary' }}>
                    Priority (Top N)
                  </Typography>
                } 
              />
            </ListItem>
          </Link>
        </List>
      </Box>

      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 12 }}>FD</Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 13, color: 'text.primary' }}>Frontend Developer</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>Frontend Eval</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      
      {/* Mobile AppBar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          display: { sm: 'none' }, 
          bgcolor: 'white', 
          color: 'text.primary', 
          boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ fontWeight: 600, fontSize: 16 }}>
            NotifyHub
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Drawers */}
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawerContent}
        </Drawer>
        
        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid', borderColor: 'divider' },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content Area */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2, sm: 3 }, 
          pt: { xs: 10, sm: 3 }, // extra top padding on mobile for AppBar
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          height: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box sx={{ 
          flex: 1,
          bgcolor: '#fff', 
          borderRadius: 2, 
          overflow: 'hidden',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          border: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
