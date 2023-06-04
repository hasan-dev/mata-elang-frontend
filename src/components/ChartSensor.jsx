import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Grid, TextField } from "@mui/material";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { VictoryPie } from "victory";

const ChartSensor = () => {
  const [sensorCounts, setSensorCounts] = useState({ active: 0, nonActive: 0 });
  const [organizationData, setOrganizationData] = useState([]);
  const accessToken = Cookies.get("access_token");
  const userId = Cookies.get("user_id");
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("");
  const [data, setData] = useState([]);

  const selectOrganization = (event) => {
    const selectedValue = event.target.value;
    if (!selectedValue) {
      setSensorCounts([]);
      setSelectedOption("");
      return;
    }
    if (selectedValue === selectedOption) {
      return;
    }
    setSelectedOption(selectedValue);
    axios
      .get("http://127.0.0.1:8002/api/test/1")
      .then((response) => {
        // console.log(response);
        setSensorCounts(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8001/api/users/${userId}`, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then(function (response) {
        console.log(response.data.data);
        const organizationDatas = response.data.data.organization.map(
          (org) => ({
            id: org.id,
            name: org.name,
          })
        );

        if (!accessToken) {
          navigate("/login");
        }

        setOrganizationData(organizationDatas);
        console.log(organizationDatas);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    // console.log(sensorCounts)
    const newData = [
      { x: "Active", y: sensorCounts.active },
      { x: "Deactive", y: sensorCounts.nonActive },
    ];
  
    // Menghapus item dengan nilai 0
    const filteredData = newData.filter((item) => item.y !== 0);
  
    setData(filteredData);
  }, [sensorCounts]);;

  return (
    <>
      <Grid container spacing={2} direction="column" w>
        <Grid item>
          <Box>
            <TextField
              id="list-organization-user"
              select
              label="Select Organization"
              defaultValue={selectedOption}
              value={selectedOption}
              onChange={selectOrganization}
              SelectProps={{
                native: true,
              }}
              helperText="Please select your organization"
            >
              <option value=""></option>
              {organizationData.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </TextField>
          </Box>
        </Grid>
        <Grid item>
          <Box sx={{ width: 300 }}>
            <VictoryPie
              data={data}
              colorScale={["#1f77b4", "#ff7f0e"]}
              width={300}
              height={300}
              innerRadius={({ datum }) => datum.y * 20}
              radius={({ datum }) => 80 + datum.y * 20}
              // innerRadius={30}
              labelPosition={"startAngle"}
              labelPlacement={"vertical"}
            />
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default ChartSensor;
