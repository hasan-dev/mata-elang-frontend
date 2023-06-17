import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import CreateUser from "./CreateUser";
import EditUser from "./EditUser";
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

export default function AllUser() {
  const [userData, setuserData] = useState({});
  const accessToken = Cookies.get("access_token");
  const navigate = useNavigate();
  const userId = Cookies.get("user_id");
  const organizationId = Cookies.get("organization_id");
  const [organizationData, setOrganizationData] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [isLoadingOrganization, setIsLoadingOrganization] = useState(true);
  const [deletionFlag, setDeletionFlag] = useState(false);
  const [OrgId, setOrgId] = useState(0);
  const [openAdd, setOpenAdd] = useState(false);
  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);
  // const [deletionFlag, setDeletionFlag] = useState(false);
  const [myKey, setMyKey] = useState(0);
  const [openEdit, setOpenEdit] = useState(false);
  const [createFlag, setCreateFlag] = useState(false);
  const [editFlag, setEditFlag] = useState(false);
  const [permissions, setPermissions] = useState([]);

  const handleOpenEdit = (userId) => {
    setOpenEdit((prevState) => ({
      ...prevState,
      [userId]: true,
    }));
  };

  const handleCloseEdit = (userId) => {
    setOpenEdit((prevState) => ({
      ...prevState,
      [userId]: false,
    }));
  };

  const handleDeleteUser = (userId) => {
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
          .delete(`${urlGateway}/users/delete/${userId}`, {
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
      .get(`${urlGateway}/users/${userId}`, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then(function (response) {
        console.log(response.data.data);
        // setuserData(response.data.data);
        setOrganizationData(response.data.data.organization[0]);
        setPermissions(response.data.data.role[0].permissions);
        // console.log(response.data.data.role[0].permissions);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${urlGateway}/organizations/${organizationId}/users/all`, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then(function (response) {
        setuserData(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [deletionFlag, createFlag, editFlag]);

  return (
    <>
      {console.log(permissions)}
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
          {/* <Box display="flex" justifyContent="space-between">
            <Button onClick={handleOpenAdd}>Add User</Button>
            <Modal
              open={openAdd}
              onClose={handleCloseAdd}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <CreateUser
                handleCloseAdd={handleCloseAdd}
                organizationId={organizationId}
              />
            </Modal>
          </Box>
        </Box> */}
          <Box display="flex" justifyContent="space-between">
            {/* {console.log(organizationData)} */}
            <Typography variant="h5">{organizationData.name} Users</Typography>
            {/* {console.log(permissions)} */}
            {permissions &&
              permissions.map((permission) => {
                if (permission.slug === "create-user") {
                  return (
                    <>
                      <Button onClick={handleOpenAdd}>Add User</Button>
                      <Modal
                        open={openAdd}
                        onClose={handleCloseAdd}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                      >
                        <CreateUser
                          handleCloseAdd={handleCloseAdd}
                          organizationId={organizationId}
                          createFlag={createFlag}
                          setCreateFlag={setCreateFlag}
                        />
                      </Modal>
                    </>
                  );
                }
              })}
            {/* <Button onClick={handleOpenAdd}>Add User</Button>
            <Modal
              open={openAdd}
              onClose={handleCloseAdd}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <CreateUser
                handleCloseAdd={handleCloseAdd}
                organizationId={organizationId}
                createFlag={createFlag}
                setCreateFlag={setCreateFlag}
              />
            </Modal> */}
          </Box>
        </Box>
        <Divider
          sx={{
            px: 10,
          }}
        >
          <Chip label="List of All User" />
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
                  <StyledTableCell align="right">Organization</StyledTableCell>
                  <StyledTableCell align="right">Email</StyledTableCell>
                  <StyledTableCell align="right">Role</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.values(userData).map((row) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell component="th" scope="row">
                      {row.id}
                    </StyledTableCell>
                    <StyledTableCell align="right">{row.name}</StyledTableCell>
                    <StyledTableCell align="right">
                      {row.organization[0].name}
                    </StyledTableCell>
                    <StyledTableCell align="right">{row.email}</StyledTableCell>
                    <StyledTableCell align="right">
                      {Array.isArray(row.role) &&
                        row.role.map((role, index) => (
                          <Typography
                            key={role.id}
                            component="span"
                            display="inline"
                          >
                            {role.name}
                            {index !== row.role.length - 1 && ", "}
                          </Typography>
                        ))}

                      {/* {console.log(row.role)} */}
                    </StyledTableCell>
                    <Stack direction="row" spacing={2} p={2}>
                      {permissions &&
                        permissions.map((permission) => {
                          if (permission.slug === "delete-user") {
                            return (
                              <Button
                                key={row.id}
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={() => handleDeleteUser(row.id)}
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
                        onClick={() => handleDeleteUser(row.id)}
                      >
                        Delete
                      </Button> */}
                      {permissions &&
                        permissions.map((permission) => {
                          if (permission.slug === "edit-user") {
                            return (
                              <>
                                <Button
                                  key={row.id}
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
                                  <EditUser
                                    userId={row.id}
                                    handleCloseEdit={handleCloseEdit}
                                    organizationId={organizationId}
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
                      </Button> */}
                      {/* <Modal
                        open={openEdit[row.id] || false}
                        onClose={() => handleCloseEdit(row.id)}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                      >
                        <EditUser
                          userId={row.id}
                          handleCloseEdit={handleCloseEdit}
                          organizationId={organizationId}
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
