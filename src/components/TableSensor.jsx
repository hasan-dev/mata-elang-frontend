import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Stack from "@mui/material/Stack";
import { Link } from "react-router-dom";

export default function TableSensor() {
  const [sensorData, setSensorData] = useState([]);
  const accessToken = Cookies.get("access_token");
  const navigate = useNavigate();

  useEffect(() => {
    // event.preventDefault();
    // handle form submit here
    axios
      .get("http://127.0.0.1:8001/api/organizations/1/sensors/all", {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then(function (response) {
        console.log(response.data.data);
        if (!accessToken) {
          // Jika access_token tidak ada, kembalikan ke halaman login
          navigate("/login");
        }
        setSensorData(response.data.data);
        // console.log(sensorData);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    console.log(sensorData);
  }, [sensorData]);

  return (
    <Card>
      <h1>Sensor</h1>
      <Divider variant="middle" />
      <br />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
                <TableCell align="right">{sensor.network_interface}</TableCell>
                <TableCell align="right">{sensor.protected_subnet}</TableCell>
                <TableCell align="right">{sensor.external_subnet}</TableCell>
                <TableCell align="right">{sensor.organization_name}</TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                    >
                      Delete
                    </Button>
                    <Link to={`/form-edit-sensor/${sensor.id}`}>
                      <Button variant="contained" endIcon={<EditIcon />}>
                        Edit
                      </Button>
                    </Link>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
