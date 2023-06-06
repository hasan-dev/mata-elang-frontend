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
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckIcon from "@mui/icons-material/Check";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

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
  const [organizationData, setOrganizationData] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [isLoadingOrganization, setIsLoadingOrganization] = useState(true);
  const [selectedNames, setSelectedNames] = useState([]);

  const selectOrganization = (event) => {
    const selectedValue = event.target.value;
    if (!selectedValue) {
      setRoleData([]);
      setSelectedOption("");
      return;
    }
    if (selectedValue === selectedOption) {
      return;
    }
    setSelectedOption(selectedValue);
    // console.log("Selected Value:", selectedValue);
    axios
      .get(`${urlGateway}/organizations/${selectedValue}/roles/all`, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then(function (response) {
        console.log(response.data.data);
        const roles = response.data.data;
        if (!accessToken) {
          navigate("/login");
        }
        console.log(roles);
        setRoleData(roles);
      })
      .catch(function (error) {
        console.log(error);
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
        // console.log(response.data.data);
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
        // console.log(organizationDatas);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

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
          <Grid container spacing={2} direction="column">
            <Grid item>
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
            </Grid>
          </Grid>
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
                      >
                        Delete
                      </Button>
                      <Button variant="contained" endIcon={<EditIcon />}>
                        Edit Role
                      </Button>
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
