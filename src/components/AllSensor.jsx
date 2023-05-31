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
  Grid,
  Box,
  tableCellClasses,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { styled } from "@mui/material/styles";
import Modal from "@mui/material/Modal";
import CreateSensor from "./CreateSensor";
import BasicModal from "./Test";
import EditSensor from "./EditSensor";

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

export default function AllSensor() {
  const [sensorData, setSensorData] = useState([]);
  const accessToken = Cookies.get("access_token");
  const userId = Cookies.get("user_id");
  const [organizationData, setOrganizationData] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [isLoadingOrganization, setIsLoadingOrganization] = useState(true);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

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
        setIsLoadingOrganization(false);
        console.log(organizationDatas);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  return (
    <>
      <Grid container spacing={2} direction="column">
        <Grid item>
          <Box display="flex" justifyContent="space-between">
            {!isLoadingOrganization && (
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
            )}
            <Button onClick={handleOpenAdd}>Add Sensor</Button>
            <Modal
              open={openAdd}
              onClose={handleCloseAdd}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <CreateSensor />
            </Modal>
          </Box>
        </Grid>
        <Grid item>
          <TableContainer
            component={Paper}
            sx={{
              p: 2,
              minWidth: 900,
              alignContent: "center",
            }}
          >
            <Table sx={{ minWidth: 600 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>ID</StyledTableCell>
                  <StyledTableCell align="right">Name</StyledTableCell>
                  <StyledTableCell align="right">UUID</StyledTableCell>
                  <StyledTableCell align="right">MQTT IP</StyledTableCell>
                  <StyledTableCell align="right">MQTT Topic</StyledTableCell>
                  <StyledTableCell align="right">MQTT Port</StyledTableCell>
                  <StyledTableCell align="right">
                    Network Interface
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    Protected Subnet
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    External Subnet
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    Organization Name
                  </StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sensorData.map((row) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell component="th" scope="row">
                      {row.id}
                    </StyledTableCell>
                    <StyledTableCell align="right">{row.name}</StyledTableCell>
                    <StyledTableCell align="right">{row.uuid}</StyledTableCell>
                    <StyledTableCell align="right">
                      {row.mqtt_ip}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {row.mqtt_topic}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {row.mqtt_port}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {row.network_interface}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {row.protected_subnet}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {row.external_subnet}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {row.organization_name}
                    </StyledTableCell>
                    <Stack direction="row" spacing={2} p={2} m={2}>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteSensor(row.id)}
                      >
                        Delete
                      </Button>
                      <Button
                        variant="contained"
                        endIcon={<EditIcon />}
                        onClick={handleOpen}
                      >
                        Edit
                      </Button>
                      <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                      >
                        <EditSensor props={row.id} />
                      </Modal>
                    </Stack>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
}
