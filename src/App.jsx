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

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/all-asset" element={<AllAsset />} />
          <Route path="/all-sensor" element={<AllSensor />} />
          <Route path="/form-sensor" element={<CreateSensor />} />
          <Route path="/form-asset" element={<CreateSensor />} />
          <Route path="/form-organization" element={<CreateOrganization />} />
          <Route path="/upload-rules/:sensorId" element={<UploadRules />} />
          <Route path="/form-edit-asset/:assetId" element={<EditAsset />} />
          <Route path="/form-edit-sensor/:sensorId" element={<EditSensor />} />
          <Route
            path="/dashboard"
            element={<PermanentDrawerLeft routes={routes} />}
          />
          <Route
            path="/form-edit-organization"
            element={<EditOrganization />}
          />
          <Route path="/chart" element={<ChartSensor />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
