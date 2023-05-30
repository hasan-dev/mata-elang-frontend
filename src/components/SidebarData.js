import MailIcon from "@mui/icons-material/Mail";
import { Dashboard, DashboardCustomize } from "@mui/icons-material";
import BusinessIcon from "@mui/icons-material/Business";
import Profile from "@mui/icons-material/AccountCircle";

export const routes = [
  { name: "Dashboard", icon: Dashboard, path: "/dashboard" },
  { name: "Sensor", icon: MailIcon, path: "/all-sensor" },
  { name: "Asset", icon: DashboardCustomize, path: "/all-asset" },
  { name: "Organization", icon: BusinessIcon, path: "/all-user" },
  { name: "Profile", icon: Profile, path: "/profile" },
];
