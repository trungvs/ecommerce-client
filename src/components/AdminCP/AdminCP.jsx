import * as React from 'react';
import { BrowserRouter as Router, Route, Switch, NavLink, useHistory } from "react-router-dom"
import { useSelector, useDispatch} from "react-redux";

import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import AdminRoutes from './AdminRoutes';

import './AdminCP.scss'

import AuthForm from "../Auth/AuthNormal";

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));



export default function PersistentDrawerLeft() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const isAuth = useSelector((state) => state.auth.auth);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
      isAuth ? (
        <div className='admincp-wrapper'>
          <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open} sx={{backgroundColor: "#fff"}}>
              <Toolbar sx={{ display: 'flex', justifyContent: 'space-between'}}>
                  { open
                  ? <IconButton
                      color="primary"
                      aria-label="open drawer"
                      onClick={handleDrawerClose}
                      edge="start"
                      sx={{ mr: 2 }}
                      >
                          <ChevronLeftIcon  />
                  </IconButton>
                  :<IconButton
                      color="primary"
                      aria-label="close drawer"
                      onClick={handleDrawerOpen}
                      edge="start"
                      sx={{ mr: 2 }}
                  >
                      <ChevronRightIcon  />
                  </IconButton>
                }
      
                <div>
                  <a href="/">
                <IconButton
                      color="primary"
                      aria-label="close drawer"
                      onClick={handleDrawerOpen}
                      edge="start"
                      sx={{ mr: 2 }}
                  >
                      <HomeWorkIcon  />
                  </IconButton>
                      </a>
                  <IconButton
                      color="primary"
                      aria-label="close drawer"
                      onClick={handleDrawerOpen}
                      edge="start"
                      sx={{ mr: 2 }}
                  >
                      <ExitToAppIcon  />
                  </IconButton>
                </div>
                
      
              </Toolbar>
            </AppBar>
            <Drawer
              sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                  width: drawerWidth,
                  boxSizing: 'border-box',
                  backgroundColor: "rgba(17, 24, 39, 1)",
                  color: "rgba(156, 163, 175, 1)"
                  // color: "rgba(229, 231, 235, 1)"
                },
              }}
              variant="persistent"
              anchor="left"
              open={open}
            >
              <DrawerHeader>
      
              </DrawerHeader>
              <Divider />
              <List>
                  { AdminRoutes.map((item, index) => (
                      <ListItem disablePadding key={index}>
                          <NavLink to={item.path} className={isActive => "navlink-text" + (!isActive ? " unselected" : "")} exact={true}>
                              <ListItemButton>
                                  <ListItemIcon sx={{ color: "rgba(229, 231, 235, 1)" }}>
                                      {<item.icon />}
                                  </ListItemIcon>
                                  <ListItemText primary={item.name} />
                              </ListItemButton>
                          </NavLink>
                      </ListItem>
                  ))}
              </List>
            </Drawer>
            <Main open={open}>
              <DrawerHeader />
                  {/* <Router> */}
                      <Switch>
                  {
                      AdminRoutes.map((route, index) => {
                          // return <Route key={index} exact path={route.path} element={<route.component />} />
                          return <Route key={index} exact path={route.path}>
                            {<route.component />}
                          </Route>
                            
                      })
                  }
                      </Switch>
                  {/* </Router> */}
            </Main>
          </Box>
        </div>
      )
      : 
      <AuthForm />
    );
}