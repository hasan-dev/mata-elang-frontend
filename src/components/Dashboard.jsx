import React from "react";
import { Routes, Route } from "react-router-dom";
import PermanentDrawerLeft from "./PermanentDrawerLeft";
import AllAsset from "./AllAsset";
import AllSensor from "./AllSensor";
import EditOrganization from "./EditOrganization";


const Dashboard = () => {
  return (
    <PermanentDrawerLeft routes={routes}>
      
    </PermanentDrawerLeft>
  );
};

export default Dashboard;
