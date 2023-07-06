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
  Avatar,
} from "@mui/material";
import { Link, Outlet, useLocation, useMatch } from "react-router-dom";
import AllSensor from "./AllSensor";
import AllAsset from "./AllAsset";
import EditOrganization from "./EditOrganization";
import ProfilePage from "./Profile";
import ChartSensor from "./ChartSensor";
import AllUser from "./AllUser";
import CreateSensor from "./CreateSensor";
import MailIcon from "@mui/icons-material/Mail";
import { Dashboard, DashboardCustomize, Logout } from "@mui/icons-material";
import BusinessIcon from "@mui/icons-material/Business";
import Profile from "@mui/icons-material/AccountCircle";
import PeopleIcon from "@mui/icons-material/People";
import AccessibilityIcon from "@mui/icons-material/Accessibility";

const PermanentDrawerLeft = ({ children }) => {
  const drawerWidth = 250;
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: Dashboard, path: "/dashboard" },
    { name: "Sensor", icon: MailIcon, path: "/dashboard/all-sensor" },
    { name: "Asset", icon: DashboardCustomize, path: "/dashboard/all-asset" },
    {
      name: "Organization",
      icon: BusinessIcon,
      path: "/dashboard/organization",
    },
    { name: "Role", icon: AccessibilityIcon, path: "/dashboard/role" },
    { name: "User", icon: PeopleIcon, path: "/dashboard/user" },
    { name: "Profile", icon: Profile, path: "/dashboard/profile" },
    { name: "Logout", icon: Logout, path: "/dashboard/logout" },
  ];

  const currentMenuItem = menuItems.find(
    (item) => item.path === location.pathname
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            {currentMenuItem ? currentMenuItem.name : "Dashboard"}
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
        <Box
          sx={{
            display: "flex",
            p: 2,
            justifyContent: "flex-start",
          }}
        >
          <Box>
            <Avatar alt="Mata Elang" src="/public/logo.jpeg" />
          </Box>
          <Box
            sx={{
              ml: 3,
              my: 1,
            }}
          >
            <Typography variant="h6">Mata Elang</Typography>
          </Box>
        </Box>
        <List>
          {menuItems.map((item) => (
            <ListItem
              key={item.path}
              button
              component={Link}
              to={item.path}
              selected={item.path === location.pathname}
            >
              <ListItemIcon>{<item.icon />}</ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main">
        <Outlet />
      </Box>
    </Box>
  );
};

export default PermanentDrawerLeft;
