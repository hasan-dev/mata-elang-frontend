import React from "react";
import { Routes, Route } from "react-router-dom";
import PermanentDrawerLeft from "./PermanentDrawerLeft";
import AllAsset from "./AllAsset";
import AllSensor from "./AllSensor";
import EditOrganization from "./EditOrganization";

const routes = [
  { name: "All Sensor", path: "/all-sensor", content: <AllSensor /> },
  { name: "All Asset", path: "/all-asset", content: <AllAsset /> },
  {
    name: "Organization",
    path: "/organization",
    content: <EditOrganization />,
  },
  // Add more routes here
];

const Dashboard = () => {
  return (
    <PermanentDrawerLeft routes={routes}>
      <Routes>
        {routes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<Content content={route.content} />}
          />
        ))}
      </Routes>
    </PermanentDrawerLeft>
  );
};

const Content = ({ content }) => {
  return content;
};

export default Dashboard;
