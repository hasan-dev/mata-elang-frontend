import {
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";

const urlGateway = import.meta.env.VITE_URL_API_GATEWAY;
const urlSensor = import.meta.env.VITE_URL_API_SENSOR;

export default function EditUser({ userId, handleCloseEdit, organizationId }) {
  const accessToken = Cookies.get("access_token");
  const [rolesData, setRolesData] = useState([]);
  const [dataUser, setDataUser] = useState({
    name: "",
    email: "",
    password: "",
    phone_number: "",
    organization_ids: [],
    role_ids: [],
  });
  const [selectedRoles, setSelectedRoles] = useState([]);

  useEffect(() => {
    axios
      .get(`${urlGateway}/users/${userId}`, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then(function (response) {
        const user = response.data.data;
        console.log(user);
        setDataUser(user);
        setSelectedRoles(user.role.map((role) => role.id));
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${urlGateway}/organizations/${organizationId}/roles/all`, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then(function (response) {
        setRolesData(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const dataUserSubmit = {
      name: dataUser.name,
      email: dataUser.email,
      password: dataUser.password,
      phone_number: dataUser.phone_number,
      organization_ids: [organizationId],
      role_ids: selectedRoles,
    };
    console.log(dataUserSubmit);
    axios
      .patch(`${urlGateway}/users/update/${userId}`, dataUserSubmit, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then(function (response) {
        console.log(response.data);
        if (response.status === "success") {
          handleCloseEdit();
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <>
      <Card
        sx={{
          maxWidth: 600,
          mx: "auto",
          my: 8,
        }}
      >
        <Typography
          variant="h2"
          align="center"
          sx={{
            marginTop: 2,
          }}
        >
          Edit User
        </Typography>
        <Divider variant="middle" />
        <br />
        <CardContent>
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TextField
              label="Name"
              fullWidth
              margin="normal"
              value={dataUser.name}
              onChange={(event) => {
                setDataUser({ ...dataUser, name: event.target.value });
              }}
            />

            <TextField
              label="Email"
              fullWidth
              margin="normal"
              type="email"
              value={dataUser.email}
              onChange={(event) => {
                setDataUser({ ...dataUser, email: event.target.value });
              }}
            />

            <TextField
              label="Password"
              fullWidth
              margin="normal"
              type="password"
              value={dataUser.password}
              onChange={(event) => {
                setDataUser({ ...dataUser, password: event.target.value });
              }}
            />

            <TextField
              label="Phone Number"
              fullWidth
              margin="normal"
              value={dataUser.phone_number}
              onChange={(event) => {
                setDataUser({ ...dataUser, phone_number: event.target.value });
              }}
            />

            <InputLabel
              sx={{
                alignSelf: "flex-start",
              }}
            >
              Roles
            </InputLabel>
            <Select
              multiple
              fullWidth
              value={selectedRoles}
              onChange={(e) => setSelectedRoles(e.target.value)}
              renderValue={(selected) => (
                <Stack gap={1} direction="row" flexWrap="wrap">
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={rolesData.find((role) => role.id === value)?.name}
                      onDelete={() =>
                        setSelectedRoles(
                          selectedRoles.filter((item) => item !== value)
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
              {rolesData.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>

            <Button
              variant="contained"
              color="primary"
              type="submit"
              size="medium"
              sx={{
                marginTop: 2,
              }}
            >
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
