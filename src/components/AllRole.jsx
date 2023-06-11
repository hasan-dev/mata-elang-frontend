import React, { useEffect, useState } from "react";
import {
  Stack,
  TextField,
  Button,
  Grid,
  styled,
  TableCell,
  tableCellClasses,
  TableRow,
  Table,
  TableHead,
  TableBody,
  Modal,
  TableContainer,
  Paper,
  Typography,
  Box,
  Divider,
  Chip,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckIcon from "@mui/icons-material/Check";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CreateRole from "./CreateRole";
import EditRole from "./EditRole";

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

export default function AllRole() {
  const [roleData, setRoleData] = useState([]);
  const accessToken = Cookies.get("access_token");
  const navigate = useNavigate();
  const userId = Cookies.get("user_id");
  const organizationId = Cookies.get("organization_id");
  const [organizationData, setOrganizationData] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [isLoadingOrganization, setIsLoadingOrganization] = useState(true);
  const [selectedNames, setSelectedNames] = useState([]);
  const [deletionFlag, setDeletionFlag] = useState(false);
  const [OrgId, setOrgId] = useState(0);
  const [open, setOpen] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [userData, setuserData] = useState({});
  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [createFlag, setCreateFlag] = useState(false);
  const [editFlag, setEditFlag] = useState(false);

  const handleOpenEdit = (roleId) => {
    setOpenEdit((prevState) => ({
      ...prevState,
      [roleId]: true,
    }));
  };

  const handleCloseEdit = (roleId) => {
    setOpenEdit((prevState) => ({
      ...prevState,
      [roleId]: false,
    }));
  };

  const handleDeleteRole = (roleId) => {
    axios
      .delete(`${urlGateway}/roles/delete/${roleId}`, {
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

  // useEffect(() => {
  //   axios
  //     .get(`${urlGateway}/users/${userId}`, {
  //       headers: {
  //         Authorization: "Bearer " + accessToken,
  //       },
  //     })
  //     .then(function (response) {
  //       setuserData(response.data.data);
  //       setOrganizationData(response.data.data.organization[0]);
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });
  // }, []);

  useEffect(() => {
    axios
      .get(`${urlGateway}/organizations/${organizationId}/roles/all`, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then(function (response) {
        const roles = response.data.data;
        setRoleData(roles);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [deletionFlag, createFlag, editFlag]);

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
            <Typography variant="h5">
              {organizationData.name} User Role
            </Typography>
          </Box>

          <Box>
            <Button onClick={handleOpenAdd}>Add Role</Button>
            <Modal
              open={openAdd}
              onClose={handleCloseAdd}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <CreateRole
                handleCloseAdd={handleCloseAdd}
                organizationId={organizationId}
                createFlag={createFlag}
                setCreateFlag={setCreateFlag}
              />
            </Modal>
          </Box>
        </Box>
        <Divider
          sx={{
            px: 10,
          }}
        >
          <Chip label="List of All Usser Role" />
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
                  <StyledTableCell align="right">Permission</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {roleData.map((row) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell component="th" scope="row">
                      {row.id}
                    </StyledTableCell>
                    <StyledTableCell align="right">{row.name}</StyledTableCell>
                    <StyledTableCell align="right">
                      {row.permissions.map((permission, index) => (
                        <Typography
                          key={permission.id}
                          component="span"
                          display="inline"
                        >
                          {permission.name}
                          {index !== row.permissions.length - 1 && ", "}
                        </Typography>
                      ))}
                    </StyledTableCell>
                    <Stack direction="row" spacing={2} p={2}>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteRole(row.id)}
                      >
                        Delete
                      </Button>
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
                        <EditRole
                          roleId={row.id}
                          handleCloseEdit={handleCloseEdit}
                          organizationId={organizationId}
                          editFlag={editFlag}
                          setEditFlag={setEditFlag}
                        />
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

{
  /* <FormControl sx={{ m: 1, width: 500 }}>
        <TextField
            label="Name"
            fullWidth
            margin="normal"
        />
        <TextField
            label="Organization"
            fullWidth
            margin="normal"
        />
        
      <Select
        multiple
        value={selectedNames}
        onChange={(e) => setSelectedNames(e.target.value)}
        input={
            <OutlinedInput
              label=""
              sx={{ color: "black" }}
              inputProps={{ 'aria-label': 'Name' }}
            />
          }
        renderValue={(selected) => (
            <Stack gap={1} direction="row" flexWrap="wrap">
              {selected.map((value) => (
                <Chip
                  key={value}
                  label={value}
                  onDelete={() =>
                    setSelectedNames(
                      selectedNames.filter((item) => item !== value)
                    )
                  }
                  deleteIcon={
                    <CancelIcon
                      onMouseDown={(event) => event.stopPropagation()}
                    />
                  }
                />
              ))}
            </Stack>
          )}
        >
          {roleData.map((roles) => (
            <MenuItem
              key={roles.id}
              value={roles.name}
              sx={{ justifyContent: "space-between" }}
            >
              {roles.name}
              {selectedNames.includes(name) ? <CheckIcon color="info" /> : null}
            </MenuItem>
          ))}
        </Select>
        <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{
              marginTop: 2,
            }}
          >
            Submit
          </Button>
      </FormControl> */
}
