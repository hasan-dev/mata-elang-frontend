import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  styled,
  tableCellClasses,
} from "@mui/material";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { VictoryPie } from "victory";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },

  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

const urlGateway = import.meta.env.VITE_URL_API_GATEWAY;
const urlSensor = import.meta.env.VITE_URL_API_SENSOR;

const ChartSensor = () => {
  const [sensorCounts, setSensorCounts] = useState({ active: 0, nonActive: 0 });
  const [organizationData, setOrganizationData] = useState([]);
  const accessToken = Cookies.get("access_token");
  const userId = Cookies.get("user_id");
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("");
  const [data, setData] = useState([]);
  const [dataLog, setDataLog] = useState([]);

  const displayLog = () => {
    console.log(selectedOption);
    axios
      .get(`${urlSensor}/log/${selectedOption}`)
      .then((response) => {
        // console.log(response);

        setDataLog(response.data.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

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
      .get(`${urlSensor}/test/${selectedValue}`)
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
      .get(`${urlGateway}/users/${userId}`, {
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
  }, [sensorCounts]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          bgcolor: "background.paper",
          border: 1,
          borderColor: "grey.500",
          flexDirection: "column",
          justifyContent: "center",
          alignContent: "center",
          borderRadius: "16px",
          boxShadow: 3,
          mt: 10,
        }}
      >
        <Box
          sx={{
            padding: 3,
          }}
        >
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
        <Box
          maxWidth={500}
          sx={{
            mx: "auto",
            my: 0,
          }}
        >
          <VictoryPie
            data={data}
            colorScale={["tomato", "orange", "gold", "cyan", "navy"]}
            width={450}
            innerRadius={({ datum }) => datum.y * 20}
            radius={({ datum }) => 80 + datum.y * 20}
            labels={({ datum }) => `${datum.x}: ${datum.y}`}
            labelPosition="centroid"
            labelPlacement={({ index }) => (index ? "parallel" : "vertical")}
          />
        </Box>
        <Box
          sx={{
            padding: 2,
          }}
        >
          <Grid container spacing={2} direction="row">
            <Grid item xs={2}>
              <Button variant="outlined" onClick={displayLog}>
                Show Log
              </Button>
            </Grid>
            <Grid item xs={8}>
              <Typography>Sensor Heartbeat Log</Typography>
            </Grid>
          </Grid>
        </Box>
        <Box
          sx={{
            padding: 3,
          }}
        >
          <TableContainer
            component={Paper}
            sx={{
              p: 2,
              minWidth: 900,
              alignContent: "center",
            }}
          >
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>UUID</StyledTableCell>
                  <StyledTableCell align="right">Name</StyledTableCell>
                  <StyledTableCell align="right">Status</StyledTableCell>
                  <StyledTableCell align="right">Last Seen</StyledTableCell>
                  <StyledTableCell align="right">Created At</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataLog.map((row) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell component="th" scope="row">
                      {row.uuid}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                      {row.name}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {row.status}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {row.last_seen}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {row.created_at}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  );
};

export default ChartSensor;
