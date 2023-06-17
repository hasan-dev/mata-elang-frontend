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
  Chip,
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
import Swal from "sweetalert2";

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
  const organizationId = Cookies.get("organization_id");
  // const [organizationData, setOrganizationData] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [isLoadingOrganization, setIsLoadingOrganization] = useState(true);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [deletionFlag, setDeletionFlag] = useState(false);
  const [editFlag, setEditFlag] = useState(false);
  const [addFlag, setAddFlag] = useState(false);
  const [OrgId, setOrgId] = useState(0);
  const [userData, setuserData] = useState({});
  const [organizationData, setOrganizationData] = useState({});
  const [permissions, setPermissions] = useState([]);

  const handleOpenEdit = (assetId) => {
    setOpenEdit((prevState) => ({
      ...prevState,
      [assetId]: true,
    }));
  };

  const handleCloseEdit = (assetId) => {
    setOpenEdit((prevState) => ({
      ...prevState,
      [assetId]: false,
    }));
  };

  const handleDeleteAsset = (assetId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${urlGateway}/assets/delete/${assetId}`, {
            headers: {
              Authorization: "Bearer " + accessToken,
            },
          })
          .then(function (response) {
            setDeletionFlag(!deletionFlag);
            Swal.fire("Deleted!", "Your file has been deleted.", "success");
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    });
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_URL_API_GATEWAY}/users/${userId}`, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then(function (response) {
        setuserData(response.data.data);
        setOrganizationData(response.data.data.organization[0]);
        setPermissions(response.data.data.role[0].permissions);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${urlGateway}/organizations/${organizationId}/assets/all`, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then(function (response) {
        setAssetData(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [deletionFlag, addFlag, editFlag]);

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
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography variant="h5">{organizationData.name} Asset</Typography>
          </Box>

          <Box>
            {permissions &&
              permissions.map((permission) => {
                if (permission.slug === "create-asset") {
                  return (
                    <>
                      <Button onClick={handleOpen}>Add Asset</Button>
                      <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                      >
                        <CreateAsset
                          organizationId={organizationId}
                          handleClose={handleClose}
                          addFlag={addFlag}
                          setAddFlag={setAddFlag}
                        />
                      </Modal>
                    </>
                  );
                }
              })}
            {/* <Button onClick={handleOpen}>Add Asset</Button>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <CreateAsset
                organizationId={organizationId}
                handleClose={handleClose}
                addFlag={addFlag}
                setAddFlag={setAddFlag}
              />
            </Modal> */}
          </Box>
        </Box>
        <Divider
          sx={{
            px: 10,
          }}
        >
          <Chip label="List of All Asset" />
        </Divider>
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
                      {permissions &&
                        permissions.map((permission) => {
                          if (permission.slug === "delete-asset") {
                            return (
                              <Button
                                key={row.id}
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={() => handleDeleteAsset(row.id)}
                              >
                                Delete
                              </Button>
                            );
                          }
                        })}
                      {/* <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteAsset(row.id)}
                      >
                        Delete
                      </Button> */}
                      {permissions &&
                        permissions.map((permission) => {
                          if (permission.slug === "edit-asset") {
                            return (
                              <>
                                <Button
                                  variant="contained"
                                  endIcon={<EditIcon />}
                                  onClick={() => handleOpenEdit(row.id)}
                                >
                                  Edit
                                </Button>
                                <Modal
                                  open={openEdit[row.id] || false}
                                  onClose={() => handleCloseEdit(row.id)}
                                  aria-labelledby="modal-modal-title"
                                  aria-describedby="modal-modal-description"
                                >
                                  <EditAsset
                                    assetId={row.id}
                                    organizationId={organizationId}
                                    handleCloseEdit={handleCloseEdit}
                                    editFlag={editFlag}
                                    setEditFlag={setEditFlag}
                                  />
                                </Modal>
                              </>
                            );
                          }
                        })}
                      {/* <Button
                        variant="contained"
                        endIcon={<EditIcon />}
                        onClick={() => handleOpenEdit(row.id)}
                      >
                        Edit
                      </Button>
                      <Modal
                        open={openEdit[row.id] || false}
                        onClose={() => handleCloseEdit(row.id)}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                      >
                        <EditAsset
                          assetId={row.id}
                          organizationId={organizationId}
                          handleCloseEdit={handleCloseEdit}
                          editFlag={editFlag}
                          setEditFlag={setEditFlag}
                        />
                      </Modal> */}
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
