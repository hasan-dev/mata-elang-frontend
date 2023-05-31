import React, { useState, useEffect } from "react";
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import AllSensor from "./AllSensor";
import AllAsset from "./AllAsset";
import EditOrganization from "./EditOrganization";
import ProfilePage from "./Profile";
import ChartSensor from "./ChartSensor";
import AllUser from "./AllUser";
import CreateSensor from "./CreateSensor";

const PermanentDrawerLeft = ({ routes }) => {
  const drawerWidth = 240;
  const [activeContent, setActiveContent] = useState(null);
  const location = useLocation();

  useEffect(() => {
    handleRouteSelect(null, location.pathname);
  }, [location]);

  const handleRouteSelect = (event, path) => {
    event?.preventDefault();
    switch (path) {
      case "/dashboard":
        setActiveContent(<ChartSensor />);
        break;
      case "/all-sensor":
        setActiveContent(<AllSensor />);
        break;
      case "/all-asset":
        setActiveContent(<AllAsset />);
        break;
      case "/organization":
        setActiveContent(<EditOrganization />);
        break;
      case "/profile":
        setActiveContent(<ProfilePage />);
        break;
      case "/user":
        setActiveContent(<AllUser />);
        break;
      case "/form-sensor":
        setActiveContent(<CreateSensor />);
        break;
      default:
        setActiveContent(null);
        break;
    }
  };

  const getRouteName = (path) => {
    const route = routes.find((route) => route.path === path);
    return route ? route.name : "";
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            {getRouteName(location.pathname)}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />
        <List>
          {routes.map((route) => (
            <ListItem
              key={route.path}
              button
              component={Link}
              to={route.path}
              exact
              onClick={(event) => handleRouteSelect(event, route.path)}
            >
              <ListItemIcon>
                <route.icon />
              </ListItemIcon>
              <ListItemText primary={route.name} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        // sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
      >
        {activeContent}
      </Box>
    </Box>
  );
};

export default PermanentDrawerLeft;
