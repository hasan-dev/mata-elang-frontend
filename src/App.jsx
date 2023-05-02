import LoginPage from "./pages/LoginPage";
import CardFormAsset from "./components/CardFormAsset.jsx";
import "./App.css";
import CardFormSensor from "./components/CardFormSensor.jsx";
import TableSensor from "./components/TableSensor.jsx";
import TableAsset from "./components/TableAsset.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CardFormOrganization from "./components/CardFormOrganization";
import CardFormEditAsset from "./components/CardFormEditAsset";
import CardFormEditSensor from "./components/CardFormEditSensor";
import CardFormEditOrganization from "./components/CardFormEditOrganization";
import PermanentDrawerLeft from "./components/PermanentDrawerLeft";
import ChartSensor from "./components/ChartSensor";

function App() {
  // const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/all-asset" element={<TableAsset />} />
          <Route path="/all-sensor" element={<TableSensor />} />
          <Route path="/form-sensor" element={<CardFormSensor />} />
          <Route path="/form-asset" element={<CardFormAsset />} />
          <Route path="/form-organization" element={<CardFormOrganization />} />
          <Route
            path="/form-edit-asset/:assetId"
            element={<CardFormEditAsset />}
          />
          <Route
            path="/form-edit-sensor/:sensorId"
            element={<CardFormEditSensor />}
          />
          <Route path="/dashboard" element={<PermanentDrawerLeft />} />
          <Route
            path="/form-edit-organization"
            element={<CardFormEditOrganization />}
          />
          <Route path="/chart" element={<ChartSensor />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
