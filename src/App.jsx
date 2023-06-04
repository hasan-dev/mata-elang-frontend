import LoginPage from "./pages/LoginPage";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PermanentDrawerLeft from "./components/PermanentDrawerLeft";
import ChartSensor from "./components/ChartSensor";
import AllAsset from "./components/AllAsset.jsx";
import AllSensor from "./components/AllSensor.jsx";
import CreateSensor from "./components/CreateSensor.jsx";
import CreateOrganization from "./components/CreateOrganization";
import UploadRules from "./components/UploadRules";
import EditAsset from "./components/EditAsset";
import EditSensor from "./components/EditSensor";
import EditOrganization from "./components/EditOrganization";
import { routes } from "./components/SidebarData";
import AllUser from "./components/AllUser";
import Layout from "./components/Layout";
import ProfilePage from "./components/Profile";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<PermanentDrawerLeft />}>
              <Route index element={<ChartSensor />} />
              <Route path="all-asset" element={<AllAsset />} />
              <Route path="all-sensor" element={<AllSensor />} />
              <Route path="organization" element={<EditOrganization />} />
              <Route path="profile" element={<ProfilePage/>} />
              <Route path="user" element={<AllUser />} />
        </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
