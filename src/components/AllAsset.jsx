import Table from "@mui/material/Table";
import { styled } from "@mui/material/styles";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Stack from "@mui/material/Stack";
import {
  Box,
  Card,
  Divider,
  Grid,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import CreateAsset from "./CreateAsset";
import EditAsset from "./EditAsset";

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

const urlGateway = import.meta.env.VITE_URL_API_GATEWAY;
const urlSensor = import.meta.env.VITE_URL_API_SENSOR;

export default function AllAsset() {
  const [assetData, setAssetData] = useState([]);
  const accessToken = Cookies.get("access_token");
  const navigate = useNavigate();
  const userId = Cookies.get("user_id");
  const [organizationData, setOrganizationData] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [isLoadingOrganization, setIsLoadingOrganization] = useState(true);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [deletionFlag, setDeletionFlag] = useState(false);
  const [OrgId, setOrgId] = useState(0);

  const handleDeleteAsset = (assetId) => {
    axios
      .delete(`${urlGateway}/assets/delete/${assetId}`, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then(function (response) {
        setDeletionFlag(!deletionFlag);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const selectOrganization = (event) => {
    const selectedValue = event.target.value;
    setOrgId(event.target.value);
    if (!selectedValue) {
      setAssetData([]);
      setSelectedOption("");
      return;
    }
    if (selectedValue === selectedOption) {
      return;
    }
    setSelectedOption(selectedValue);
    // console.log("Selected Value:", selectedValue);
    // axios
    //   .get(`${urlGateway}/organizations/${selectedValue}/assets/all`, {
    //     headers: {
    //       Authorization: "Bearer " + accessToken,
    //     },
    //   })
    //   .then(function (response) {
    //     console.log(response.data.data);
    //     if (!accessToken) {
    //       navigate("/login");
    //     }
    //     setAssetData(response.data.data);
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_URL_API_GATEWAY}/users/${userId}`, {
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

  useEffect(() => {
    axios
      .get(`${urlGateway}/organizations/${OrgId}/assets/all`, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then(function (response) {
        console.log(response.data.data);
        if (!accessToken) {
          navigate("/login");
        }
        setAssetData(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [OrgId, deletionFlag]);

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
            p: 3,
          }}
        >
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
            <Button onClick={handleOpen}>Add Asset</Button>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <CreateAsset />
            </Modal>
          </Box>
        </Box>
        <Box
          sx={{
            p: 3,
          }}
        >
          <TableContainer
            component={Paper}
            sx={{
              p: 2,
              maxWidth: 900,
              alignContent: "center",
              margin: "auto",
            }}
          >
            <Table sx={{ minWidth: 600 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>ID</StyledTableCell>
                  <StyledTableCell align="right">Name</StyledTableCell>
                  <StyledTableCell align="right">Description</StyledTableCell>
                  <StyledTableCell align="right">PIC</StyledTableCell>
                  <StyledTableCell align="right">Sensor Name</StyledTableCell>
                  <StyledTableCell align="center">
                    Organization Name
                  </StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assetData.map((row) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell component="th" scope="row">
                      {row.id}
                    </StyledTableCell>
                    <StyledTableCell align="right">{row.name}</StyledTableCell>
                    <StyledTableCell align="right">
                      {row.description}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {row.user_name}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {row.sensor_name}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {row.organization_name}
                    </StyledTableCell>
                    <Stack direction="row" spacing={2} p={2}>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteAsset(row.id)}
                      >
                        Delete
                      </Button>
                      <Button
                        variant="contained"
                        endIcon={<EditIcon />}
                        onClick={handleOpen}
                      >
                        Edit Asset
                      </Button>
                      <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                      >
                        <EditAsset props={row.id} />
                      </Modal>
                    </Stack>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  );
}
