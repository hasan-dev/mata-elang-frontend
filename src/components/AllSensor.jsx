import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Stack,
  TextField,
  FormControl,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export default function AllSensor() {
  const [sensorData, setSensorData] = useState([]);
  const accessToken = Cookies.get("access_token");
  const userId = Cookies.get("user_id");
  const [organizationData, setOrganizationData] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const navigate = useNavigate();

  const handleDeleteSensor = (sensorId) => {
    axios
      .delete(`http://127.0.0.1:8001/api/sensors/delete/${sensorId}`, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then(function (response) {
        console.log(response.status, response.data);
        navigate("/all-sensor");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const selectOrganization = (event) => {
    const selectedValue = event.target.value;
    if (!selectedValue) {
      setSensorData([]);
      setSelectedOption("");
      return;
    }
    if (selectedValue === selectedOption) {
      return;
    }
    setSelectedOption(selectedValue);
    console.log("Selected Value:", selectedValue);
    axios
      .get(
        `http://127.0.0.1:8001/api/organizations/${selectedValue}/sensors/all`,
        {
          headers: {
            Authorization: "Bearer " + accessToken,
          },
        }
      )
      .then(function (response) {
        console.log(response.data.data);
        if (!accessToken) {
          navigate("/login");
        }
        setSensorData(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // useEffect(() => {
  //   axios
  //     .get("http://127.0.0.1:8001/api/organizations/1/sensors/all", {
  //       headers: {
  //         Authorization: "Bearer " + accessToken,
  //       },
  //     })
  //     .then(function (response) {
  //       console.log(response.data.data);
  //       if (!accessToken) {
  //         navigate("/login");
  //       }
  //       setSensorData(response.data.data);
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });
  // }, []);

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

  return (
    <>
      <FormControl variant="outlined" sx={{ marginBottom: "20px" }}>
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
      </FormControl>
      <Card>
        <CardContent>
          <h1>All Sensor</h1>
          <Divider variant="middle" />
          <br />
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 1200 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="right">Id</TableCell>
                  <TableCell align="right">Name</TableCell>
                  <TableCell align="right">UUID</TableCell>
                  <TableCell align="right">MQTT IP</TableCell>
                  <TableCell align="right">MQTT Topic</TableCell>
                  <TableCell align="right">MQTT Port</TableCell>
                  <TableCell align="right">Network Interface</TableCell>
                  <TableCell align="right">Protected Subnet</TableCell>
                  <TableCell align="right">External Subnet</TableCell>
                  <TableCell align="right">Organization Name</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sensorData.map((sensor) => (
                  <TableRow
                    key={sensor.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="right">{sensor.id}</TableCell>
                    <TableCell align="right">{sensor.name}</TableCell>
                    <TableCell align="right">{sensor.uuid}</TableCell>
                    <TableCell align="right">{sensor.mqtt_ip}</TableCell>
                    <TableCell align="right">{sensor.mqtt_topic}</TableCell>
                    <TableCell align="right">{sensor.mqtt_port}</TableCell>
                    <TableCell align="right">
                      {sensor.network_interface}
                    </TableCell>
                    <TableCell align="right">
                      {sensor.protected_subnet}
                    </TableCell>
                    <TableCell align="right">
                      {sensor.external_subnet}
                    </TableCell>
                    <TableCell align="right">
                      {sensor.organization_name}
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={2}>
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeleteSensor(sensor.id)}
                        >
                          Delete
                        </Button>
                        <Button
                          variant="contained"
                          endIcon={<EditIcon />}
                          onClick={() =>
                            navigate(`/form-edit-sensor/${sensor.id}`)
                          }
                        >
                          Edit
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </>
  );
}
